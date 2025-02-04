import { FC } from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

interface FileInputProps {
  id: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export const FileInput: FC<FileInputProps> = ({ id, accept, onChange, value }) => {
  return (
    <FormItem>
      <FormLabel htmlFor={id}>Upload Document</FormLabel>
      <FormControl>
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className="w-full border p-2 rounded-md"
        />
      </FormControl>
      <FormMessage>{value ? 'File selected' : 'No file selected'}</FormMessage>
    </FormItem>
  );
};

export default FileInput;
