import React, {useState} from 'react'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const CreateSurvey = ({contract}) => {

  const [uri, setUri] = useState('');
  const [options, setOptions] = useState(2);
  const [endDate, setEndDate] = useState('');

  const createSurvey = async () => {

    debugger;


    if(!contract){
      alert('Please connect to MetaMask');
      return;
    }

    await contract.createSurvey(uri, new Date(endDate).getTime(), options).then(
      () => {
        alert('Success')
      }
    ).catch((error) => alert(error.message))
  }

  return (
    <Form className='m-2'>
      <h2 className='d-flex justify-content-center'> Create Survey</h2>
      <Form.Group className='m-2'>
        <label htmlFor='uri'>IPFS URI</label>
        <Form.Control 
          type='text' 
          name='uri' 
          placeholder='IPFS URI' 
          value={uri} 
          onChange={e => {
            setUri(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className='m-2'>
        <label htmlFor='options'>Number of Options</label>
        <Form.Control 
          type='number'
          min={2}
          max={8} 
          name='options' 
          value={options} 
          onChange={e => {
            setOptions(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className='m-2'>
        <label htmlFor='endDate'>End Date</label>
        <Form.Control 
          type='date'
          name='endDate' 
          value={endDate} 
          onChange={e => {
            setEndDate(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className='m-2 mt-4'>
        <Button variant='success' onClick={createSurvey}>
          Create
        </Button>
      </Form.Group>
      
    </Form>
  )
}

export default CreateSurvey;