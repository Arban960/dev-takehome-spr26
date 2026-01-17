import { useState, useRef, useEffect } from 'react';

type DropdownProps = {
  value: string;
  options?: string[];
  id: number
};

export default function Dropdown({ value, options = [], id }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultOptions = ['Completed', 'Pending', 'Approved', 'Rejected'];
  const [selected, setSelected] = useState<string>("")
  const displayOptions = options.length > 0 ? options : defaultOptions;

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
    return 'text-green-800 bg-green-300';
      case 'approved':
        return 'text-yellow-800 bg-yellow-300';
      case 'rejected':
        return 'text-red-800 bg-red-100';
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (option: string) => {
    setIsOpen(false);
    setSelected(option)
     const res = await fetch(`/api/mock/request`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id, status: option }),
  });
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex justify-between items-center w-full px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selected ? selected : value)} hover:opacity-90 focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={getStatusColor(selected ? selected : value)+ 'block rounded-full mt-1 text-left text-sm font-medium hover:bg-blue-50 hover:bg-opacity-60 '}>
                    {selected ? selected : value}

        </div>
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white border border-gray-200 z-10">
          <div className="py-1">
            {displayOptions.map((option, index) => (
              <button
                key={index}
                style={{
                    opacity:0.7
                }}
                className={`block rounded-lg mt-1 text-left px-1 py-1 text-sm font-medium ${getStatusColor(option)} hover:bg-blue-50 hover:bg-opacity-30 ${
                  option === value ? 'ring-1 ring-blue-300' : ''
                }`}
                onClick={(e) => {
                    
                    handleSelect(option)}}
              >
                · {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}