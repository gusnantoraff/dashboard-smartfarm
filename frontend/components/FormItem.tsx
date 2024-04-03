import React, { useState } from 'react';

import { Field } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Text,
} from '@chakra-ui/react';
//import { useQueryCluster } from '@/hooks/useCluster';

type Props = {
  name: string;
  placeholder?: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'datetime-local'
    | 'time';
  defaultValue?: string;
  options?: any[];
};

type PropsSelect = {
  name: string;
  placeholder?: string;
  options: any[];
};

interface FormItemProps extends Props {
  children: React.ReactNode;
}

type PasswordProps = {
  name: string;
  placeholder?: string;
};

const capitalize = (s: string) => {
  const split = s.split('_');

  if (split.length > 1) {
    return split
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(' ');
  }

  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const FormItem = ({ children, name, type }: FormItemProps) => (
  <Field name={name} type={type}>
    {({ form }: any) => (
      <FormControl isInvalid={form.errors[name] && form.touched[name]}>
        <FormLabel fontSize={'14px'}>{capitalize(name)}</FormLabel>
        {children}
        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
);
/*
const ClusterDropdown = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) => {
  const { data, loading, error } = useQueryCluster('GET', {
    variables: { pagination: { page: 1, limit: 25 } },
    pollInterval: 5000,
  });
  const options = data?.ListClusterWithPagination.clusters.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel fontSize={'14px'}>
            {placeholder ? placeholder : capitalize(name)}
          </FormLabel>
          <Select
            fontSize={'14px'}
            type={'select'}
            {...field}
            placeholder={placeholder ? placeholder : capitalize(name)}
          >
            {loading ? (
              <Spinner />
            ) : error ? (
              <option>
                <Text color='status.error'></Text>
              </option>
            ) : (
              options
            )}
          </Select>
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
*/

// input type
const SelectDefault = ({ name, placeholder, options = [] }: PropsSelect) => (
  <Field name={name}>
    {({ field, form }: any) => (
      <FormControl
        w={'auto'}
        isInvalid={form.errors[name] && form.touched[name]}
      >
        <FormLabel fontSize={'14px'}>
          {placeholder ? placeholder : capitalize(name)}
        </FormLabel>
        <Select
          p='0'
          m='0'
          w={'auto'}
          fontSize={'14px'}
          {...field}
          placeholder={placeholder ? placeholder : capitalize(name)}
        >
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
);
// input type
const SelectItem = ({ name, placeholder, options = [] }: PropsSelect) => (
  <Field name={name}>
    {({ field, form }: any) => (
      <FormControl
        display={'inline-block'}
        w={'auto'}
        isInvalid={form.errors[name] && form.touched[name]}
      >
        <Select
          p='0'
          m='0'
          variant='flushed'
          display={'inline-block'}
          w={'auto'}
          fontSize={'14px'}
          {...field}
          placeholder={placeholder ? placeholder : capitalize(name)}
        >
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
);

const Number = ({ name, placeholder }: Props) => {
  return (
    <Field name={name} type='number'>
      {({ field, form }: any) => (
        <FormControl
          display={'inline-block'}
          w={'auto'}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <NumberInput
            defaultValue={field.value}
            _placeholder={placeholder ? placeholder : capitalize(name)}
            max={100}
            min={0}
            precision={2}
            step={0.01}
            clampValueOnBlur={true}
            display={'inline-block'}
            onChange={(value) => {
              form.setFieldValue(name, value);
            }}
          >
            <NumberInputField {...field} />
            <NumberInputStepper>
              <NumberIncrementStepper {...field} />
              <NumberDecrementStepper {...field} />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const InputItemInline = ({ name, type, placeholder }: Props) => (
  <Field name={name} type={type}>
    {({ field, form }: any) => (
      <FormControl
        display={'inline-block'}
        w={'auto'}
        isInvalid={form.errors[name] && form.touched[name]}
      >
        <Input
          textAlign={'right'}
          p='0'
          m='0'
          variant='flushed'
          display={'inline-block'}
          w={'auto'}
          fontSize={'14px'}
          type={type}
          {...field}
          placeholder={placeholder ? placeholder : capitalize(name)}
        />
        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
);

// input type
const InputItem = ({ name, type, placeholder }: Props) => (
  <Field name={name} type={type}>
    {({ field, form }: any) => (
      <FormControl isInvalid={form.errors[name] && form.touched[name]}>
        <FormLabel fontSize={'14px'}>
          {placeholder ? placeholder : capitalize(name)}
        </FormLabel>
        <Input
          fontSize={'14px'}
          type={type}
          {...field}
          placeholder={placeholder ? placeholder : capitalize(name)}
        />
        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
);

// password type
const PasswordItem = ({ name, placeholder }: PasswordProps) => {
  const [show, setShow] = useState(false);

  const togglePass = () => setShow(!show);

  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel fontSize={'14px'}>
            {placeholder ? placeholder : capitalize(name)}
          </FormLabel>
          <InputGroup size='md'>
            <Input
              fontSize={'14px'}
              pr='4.5rem'
              {...field}
              type={show ? 'text' : 'password'}
              placeholder={placeholder ? placeholder : capitalize(name)}
            />
            <InputRightElement>
              <img
                className='cursor-pointer'
                src={`icons/EYE ${show ? 'ON.svg' : 'OFF.svg'}`}
                alt=''
                onClick={togglePass}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

FormItem.Input = InputItem;
FormItem.Password = PasswordItem;
//FormItem.ClusterDropdown = ClusterDropdown;
FormItem.InputInline = InputItemInline;
FormItem.Select = SelectItem;
FormItem.SelectDefault = SelectDefault;
FormItem.Number = Number;

export default FormItem;
