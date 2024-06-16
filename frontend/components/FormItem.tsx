import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Field } from 'formik';
import { Cluster } from '../../backend/src/cluster/entities/cluster.entity';
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

const ClusterDropdown = ({ name, placeholder }: { name: string; placeholder: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await axios.get('http://localhost:4000/clusters/all');
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError('Invalid data format');
        }
      } catch (error) {
        setError('Failed to fetch clusters');
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, []);

  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel fontSize={'14px'}>
            {placeholder ? placeholder : capitalize(name)}
          </FormLabel>
          <Select
            fontSize={'14px'}
            {...field}
            placeholder={placeholder ? placeholder : capitalize(name)}
          >
            {loading ? (
              <Spinner />
            ) : error ? (
              <option>
                <Text color='red.500'>{error}</Text>
              </option>
            ) : (
              data.map((item: any) => (
                <option key={item.cluster_id} value={item.cluster_id}>
                  {item.name}
                </option>
              ))
            )}
          </Select>
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const TemplateDropdown = ({ name, placeholder }: { name: string; placeholder: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:4000/templates/all');
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError('Invalid data format');
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch templates');
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel fontSize={'14px'}>
            {placeholder ? placeholder : capitalize(name)}
          </FormLabel>
          <Select
            fontSize={'14px'}
            {...field}
            placeholder={placeholder ? placeholder : capitalize(name)}
          >
            {loading ? (
              <Spinner />
            ) : error ? (
              <option>
                <Text color='red.500'>{error}</Text>
              </option>
            ) : (
              data.map((item: any) => (
                <option key={item.template_id} value={item.template_id}>
                  {item.name}
                </option>
              ))
            )}
          </Select>
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

// Input type components
const SelectDefault = ({ name, placeholder, options = [] }: PropsSelect) => (
  <Field name={name}>
    {({ field, form }: any) => (
      <FormControl w={'auto'} isInvalid={form.errors[name] && form.touched[name]}>
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

const SelectItem = ({ name, placeholder, options = [] }: PropsSelect) => (
  <Field name={name}>
    {({ field, form }: any) => (
      <FormControl display={'inline-block'} w={'auto'} isInvalid={form.errors[name] && form.touched[name]}>
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

const Number = ({ name, placeholder }: Props) => (
  <Field name={name} type='number'>
    {({ field, form }: any) => (
      <FormControl display={'inline-block'} w={'auto'} isInvalid={form.errors[name] && form.touched[name]}>
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

const InputItemInline = ({ name, type, placeholder }: Props) => (
  <Field name={name} type={type}>
    {({ field, form }: any) => (
      <FormControl display={'inline-block'} w={'auto'} isInvalid={form.errors[name] && form.touched[name]}>
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
FormItem.ClusterDropdown = ClusterDropdown
FormItem.TemplateDropdown = TemplateDropdown;
FormItem.InputInline = InputItemInline;
FormItem.Select = SelectItem;
FormItem.SelectDefault = SelectDefault;
FormItem.Number = Number;

export default FormItem;