import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const PassInput = ({placeholder, name, mb, onChange}) => {
        const [show, setShow] = React.useState(false)
        const handleClick = () => setShow(!show)
      
        return (
          <InputGroup mb={mb} size='md'>
            <Input
            name={name}
            onChange={onChange}
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder={placeholder}
            />
            <InputRightElement width='1.5rem' pr={2}>
                {show ? <FiEyeOff h='1.75rem' size='sm' onClick={handleClick}/>: <FiEye h='1.75rem' size='sm' onClick={handleClick}/>}
            </InputRightElement>
          </InputGroup>
        )
};

export default PassInput;