import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import LoadingButton from '../components/Button/LoadingButton';
import { notification } from 'antd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const shortenAddress = (address) => {
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
};

const remainingTime = (endTime) => {
    const currentTime = new Date().getTime();
    const remaining = endTime - currentTime;

    if(remaining <= 0) return 'Poll Ended';

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    
    if(days > 0) return `Ends in: ${days} days`;

    const hours = Math.floor(remaining / (1000 * 60 * 60));

    if(hours > 0) return `Ends in: ${hours} hours`;

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (minutes > 0) return `Ends in: ${minutes} minutes, ${seconds} seconds`;

    return `Ends in: ${seconds} seconds`;
}

const Polls = ({contract}) => {

    const [polls, setPolls] = useState([]);

    const handleVote = async (id, optionIdx) => {
        try {
            const tx = await contract.vote(id, optionIdx);
            const receipt = await tx.wait();

            notification.success({
                message: 'Vote Successful',
                description: `Voted for poll ${receipt.events[0].args.pollId.toNumber()}.`,
                placement: 'topRight',
                duration: 3,
            });
        }

        catch (error) {
            notification.error({
                message: 'Vote Failed',
                description: error.message,
                placement: 'topRight',
                duration: 3,
            });
        }
    }

    const sortPolls = (polls) => {
        return polls.sort((a, b) => {
            return b.createdAt - a.createdAt;
            });
        };

    const updatePolls = async () => {
        const filter = contract.filters.PollCreated();

        contract.queryFilter(filter).then((result) => {
            console.log(result);
            setPollsData(result);
        }).catch((error) => alert(error.message));
    }

    useEffect(() => {

        if(!contract) return;

        updatePolls();
      
    }, [contract]);

    useEffect(() => {

        if(!contract) return;

        contract.on('Voted', () => {
            updatePolls();
        });

        return () => {
            contract.off('Voted');
        }

    }, [contract]);

    const setPollsData = async (polls) => {
        const promises = [];
        const newPolls = [];
        for (const poll of polls) {
          const { owner, pollId, createdAt, endTime } = poll.args;
          const promise = contract.getPoll(pollId).then(async (pollData) => {

            const options = pollData[1].map((option, idx) => {
                return {
                    option,
                    votes: pollData[2][idx].toNumber(),
                };
            });

            const voted = await contract.didVote(pollId);
        
            const newPoll = {
              id: pollId.toNumber(),
              owner: owner,
              createdAt: createdAt.toNumber(),
              endTime: endTime.toNumber(),
              question: pollData[5],
              totalVotes: pollData[4].toNumber(),
              options: options,
              voted: voted,
            };

            newPolls.push(newPoll);
            
          });
          promises.push(promise);
        }
    
        await Promise.all(promises);

        setPolls(sortPolls(newPolls));
      };
    

      return (
        <div>
          {polls && polls.map((poll) => (
            <Card key={poll.id} className="my-2 mb-3">
              <Card.Header>
                <Card.Title>{poll.question}</Card.Title>
            </Card.Header>
              <Card.Body>
                {poll.options.map((option, idx) => (
                  <div className="mt-1" key={Math.random() + idx}>
                    <p>
                        {option.option} - {(option.votes / Math.max(1, poll.totalVotes)) * 100}%
                    </p>
                    <div className="d-flex w-100 align-items-center">
                      <ProgressBar
                        now={(option.votes / Math.max(1, poll.totalVotes)) * 100}
                        label={`${option.votes}`}
                        className="w-100 me-2"
                      />

                        <LoadingButton
                            buttonText="Vote"
                            handleOnClick={() => handleVote(poll.id, idx)}
                            variant="dark"
                            disabled={poll.voted}
                        />
                      
                    </div>
                  </div>
                ))}
              </Card.Body>
              <Card.Footer>

                <Row>
                    <Col xs='auto' sm={5}>
                        <small className="text-muted">
                            Created by {shortenAddress(poll.owner)} on {' '}{new Date(poll.createdAt * 1000).toLocaleString()}
                        </small>
                    </Col>
                    <Col xs='auto' sm={4}>
                        <small className="text-muted">
                            Total Votes: {poll.totalVotes}
                        </small>
                    </Col>
                    <Col xs='auto'
                    >
                        <small className="text-muted">
                            {remainingTime(poll.endTime)}
                        </small>
                    </Col>
                </Row>
                
              </Card.Footer>
            </Card>
          ))}
        </div>
      );
}

export default Polls;