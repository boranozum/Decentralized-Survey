import React, {useState} from 'react'
import Form from 'react-bootstrap/Form';
import LoadingButton from '../components/Button/LoadingButton';
import Button from 'react-bootstrap/Button';
import {notification} from 'antd';
import { Col, Row } from 'react-bootstrap';

const convertToDate = (minutes) => {
    const currentTime = new Date().getTime();
    const endTime = currentTime + minutes * 60 * 1000;

    return new Date(endTime).getTime();
}

const CreatePoll = ({contract}) => {

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endDate, setEndDate] = useState('1');

  const handeCreate = async () => {

    if(!contract){
      alert('Please connect to MetaMask');
      return;
    }

    const tx = await contract.createPoll(options, questionText, convertToDate(endDate), options.length);

    const receipt = await tx.wait();

    notification.success({
        message: 'Poll Created',
        description: `Poll ${receipt.events[0].args.pollId.toNumber()} created successfully.`,
        placement: 'topRight',
        duration: 3,
        });
  }

  return (
    <Form className='m-2'>
      <h2 className='d-flex justify-content-center'> Create Poll</h2>

      <Form.Group className='m-2'>
        <label htmlFor='questionText'>Question</label>
        <Form.Control 
          type='text' 
          name='questionText' 
          placeholder='Question' 
          value={questionText} 
          onChange={e => {
            setQuestionText(e.target.value);
          }}
        />
      </Form.Group>

      {options.map((option, idx) => (
        <Form.Group className='m-2' key={idx}>
            <label htmlFor='option'>
                Option {idx + 1}
            </label> 
            <Form.Control
                type='text'
                name={`option${idx+1}`}
                value={option}
                onChange={e => {
                    const newOptions = [...options];
                    newOptions[idx] = e.target.value;
                    setOptions(newOptions);
                }}
            />
        </Form.Group>
      ))}

      {options.length < 9 && (
        <Form.Group className='m-2 d-flex justify-content-center'>
            <Button variant='primary' onClick={() => {
                const newOptions = [...options];
                newOptions.push('');
                setOptions(newOptions);
                }
            }>
                Add Option
            </Button>
        </Form.Group>
      )}
      
      
      <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            height: '100px',
        }} className='m-2 mt-4'
      >
        <Row>
            <Col md={8}>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        Ends in:
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Select
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        >
                            <option value='1'>1 min</option>
                            <option value='5'>5 min</option>
                            <option value='10'>10 min</option>
                            <option value='15'>30 min</option>
                            <option value='60'>1 hour</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Col>
            <Col md={4}>
                <LoadingButton
                    buttonText='Create'
                    handleOnClick={handeCreate}
                    variant='success'
                    redirect={true}
                />
            </Col>
        </Row>
        
      </div>
      
      
      
    </Form>
  )
}

export default CreatePoll;