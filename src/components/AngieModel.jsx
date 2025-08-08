import { useState } from 'react';

export default function Modal({ isOpen, onClose, onSave }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState('memory');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div className="p-6 w-full max-w-md bg-white rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-[#121019]">Add {type === 'memory' ? 'Memory' : 'Gratitude'}</h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب اللي نفسك تقوله لإنجي 🌷"
          className="w-full p-3 rounded bg-[#f3f3f6] mb-4"
          rows={4}
        />
        <input
          type="text"
          placeholder="رابط صورة"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="p-2 mb-4 w-full rounded border"
        />

        <div className="flex justify-between mb-4">
          <button onClick={() => setType('memory')} className={`px-4 py-2 rounded-full ${type === 'memory' ? 'bg-[#bcadea]' : 'bg-gray-200'}`}>Memory</button>
          <button onClick={() => setType('gratitude')} className={`px-4 py-2 rounded-full ${type === 'gratitude' ? 'bg-[#bcadea]' : 'bg-gray-200'}`}>Gratitude</button>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-full">Cancel</button>
          <button onClick={() => onSave({ content, image }, type)} className="px-4 py-2 bg-[#30e898] text-[#121019] rounded-full font-bold">Save</button>
        </div>
      </div>
    </div>
  );
}
