import React, {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';

const Votes = ({contract}) => {

    const gateway = "https://amber-neighbouring-anglerfish-405.mypinata.cloud/ipfs/";
    const [votes, setVotes] = useState([]);

    const votePressed = async (id, optionIdx) => {
        await contract.vote(id, optionIdx).then(() => alert('success'))
        .catch((error) => alert(error.message));
    }

    useEffect(() => {

        if(!contract) return;

        const filter = contract.filters.SurveyCreated();

        contract.queryFilter(filter).then((result) => {
            setVotesData(result);
        }).catch((error) => alert(error.message));
      
    }, [contract])

    const setVotesData = async (votes) => {
        const promises = [];
        const newVotes = [];
        for (const vote of votes) {
          const { owner, surveyId, createdAt, endTime } = vote.args;
          const promise = contract.getVote(surveyId).then(async (voteData) => {
            const uri = voteData[0];
            debugger;

            if (!uri) return;
    
            const currentVotes = voteData[2];
            const currentVotesNumbers = currentVotes.map((val) => val.toNumber());
    
            const newVote = {
              id: surveyId.toNumber(),
              owner: owner,
              createdAt: createdAt.toNumber(),
              endTime: endTime.toNumber(),
              totalVotes: currentVotesNumbers.reduce(
                (sum, value) => sum + value,
                0
              ),
              votes: currentVotesNumbers,
            };
    
            try {
              await fetch(gateway + uri)
                .then((result) => result.json())
                .then((data) => {
                  newVote.description = data.description;
                  newVote.options = data.options;

                  console.log(newVote);
                  newVotes.push(newVote);
                });
            } catch {}
          });
          promises.push(promise);
        }

    
        await Promise.all(promises);

        console.log(newVotes);

        setVotes(newVotes);
      };
    

      return (
        <div>
          {votes.map((vote) => (
            <Card key={vote.id} className="my-2">
              <Card.Header>{vote.description}</Card.Header>
              <Card.Body>
                {vote.options.map((option, idx) => (
                  <div className="mt-1" key={Math.random() + idx}>
                    <p>
                      {option}:{" "}
                      {(vote.votes[idx] / Math.max(1, vote.totalVotes)) * 100}%
                    </p>
                    <div className="d-flex w-100 align-items-center">
                      <ProgressBar
                        now={(vote.votes[idx] / Math.max(1, vote.totalVotes)) * 100}
                        label={`${vote.votes[idx]}`}
                        className="w-100 me-2"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          votePressed(vote.id, idx);
                        }}
                        variant="dark"
                      >
                        Vote
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          ))}
        </div>
      );
}

export default Votes;