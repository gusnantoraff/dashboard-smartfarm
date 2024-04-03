import React from 'react';
import axios from 'axios';
import { HStack, Select, Spinner } from '@chakra-ui/react';

type Props = {
  setPagination?: (value: any) => void;
  onSelect?: (value: any) => void;
  [x: string]: any;
  modelKey: 'clusterId';
  noIcon?: boolean;
};

interface State {
  options: { value: string; label: string }[];
  loading: boolean;
}

class FilterDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      options: [],
      loading: true,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/clusters');
      if (response.data) {
        const options = response.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));
        this.setState({ options, loading: false });
      }
    } catch (error) {
      console.error('Error fetching clusters:', error);
      this.setState({ loading: false });
    }
  }

  render() {
    const { setPagination, modelKey, onSelect, noIcon, ...rest } = this.props;
    const { options, loading } = this.state;

    return (
      <HStack {...rest}>
        {loading ? (
          <Spinner />
        ) : (
          <Select
            onChange={(e) => {
              if (setPagination) {
                setPagination((prev: any) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    [modelKey]: e.target.value,
                  },
                }));
              }
              if (onSelect) {
                onSelect(e.target.value);
              }
            }}
          >
            {options.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        )}
      </HStack>
    );
  }
}

export default FilterDropdown;
