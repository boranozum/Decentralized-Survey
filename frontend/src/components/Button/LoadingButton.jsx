import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import {useNavigate} from 'react-router-dom';

const LoadingButton = ({buttonText, handleOnClick, redirect, variant, disabled}) => {

    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

  return (
    <Button
        variant={variant}
        disabled={loading || disabled}
        onClick={async () => {
            setLoading(true);
            await handleOnClick();
            setLoading(false);

            if(redirect) navigate('/polls');
        }}
    >
        {loading ? 
            <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
            />
            :
            buttonText
        }
    </Button>
  )
}

LoadingButton.defaultProps = {
    redirect: false,
    variant: 'success',
    disabled: false,
}

export default LoadingButton