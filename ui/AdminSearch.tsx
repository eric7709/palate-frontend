'use client'

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function AdminSearch({ value, onChange }: Props) {
  return (
     <div className='h-10 border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950 rounded-full '>
        <input  value={value}
        onChange={(e) => onChange(e.target.value)} type="text" className='h-full text-[13px] pl-4 w-full outline-none border-none font-light text-white placeholder:text-gray-200' placeholder='Search by name or description…' name="" id="" />
    </div>
  );
}