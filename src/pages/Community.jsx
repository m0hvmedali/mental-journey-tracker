import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { ArrowLeft, BadgeAlertIcon, ClockFading, GraduationCap, HeartHandshake } from 'lucide-react';
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqCbCIDd-u57t10x_8I9-LbGlDXGy2MKM",
  authDomain: "ssoul-bbfd8.firebaseapp.com",
  databaseURL: "https://ssoul-bbfd8-default-rtdb.firebaseio.com",
  projectId: "ssoul-bbfd8",
  storageBucket: "ssoul-bbfd8.firebasestorage.app",
  messagingSenderId: "1059391922267",
  appId: "1:1059391922267:web:f9ad8495b2c8f481895f7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App = () => {
  // States
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memoryType, setMemoryType] = useState('gratitude');
  const [memoryText, setMemoryText] = useState('');
  const [memoryImage, setMemoryImage] = useState(null);
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const nav = useNavigate();

  // Timer state
  const [timer, setTimer] = useState({
    months: 7,
    days: 20,
    hours: 15,
    minutes: 0,
    seconds: 0
  });

  // Placeholder images
  const placeholderImages = [
   "https://picsum.photos/seed/book1/600/400",
  "https://picsum.photos/seed/book2/600/400",
  "https://picsum.photos/seed/book3/600/400",
  "https://picsum.photos/seed/book4/600/400",
  "https://picsum.photos/seed/book5/600/400",
  "https://picsum.photos/seed/book6/600/400",
  "https://picsum.photos/seed/book7/600/400",
  "https://picsum.photos/seed/book8/600/400",
  "https://picsum.photos/seed/book9/600/400",
  "https://picsum.photos/seed/book10/600/400"
  ];
  

  // Fetch memories
  useEffect(() => {
    const memoriesRef = ref(database, 'memories');
    const unsubscribe = onValue(memoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const memoriesArray = Object.keys(data).map(key => {
          const mem = data[key];
          return {
            id: key,
            ...mem,
            image: mem.image === '[LOCAL_IMAGE]' ? placeholderImages[0] : mem.image
          };
        });
        setMemories(memoriesArray);
      }
    });
    return () => unsubscribe();
  }, []);
  
  

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => updateTimer(prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTimer = (prev) => {
    let { months, days, hours, minutes, seconds } = prev;
    seconds++;
    if (seconds >= 60) { seconds = 0; minutes++; }
    if (minutes >= 60) { minutes = 0; hours++; }
    if (hours >= 24) { hours = 0; days++; }
    if (days >= 30) { days = 0; months++; }
    return { months, days, hours, minutes, seconds };
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setMemoryImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Save memory - Optimized for instant save
  const saveMemory = () => {
    if (!memoryText.trim()) {
      console.warn('Memory text is empty');
      return;
    }
  
    const timestamp = Date.now();
  
    const newMemory = {
      type: memoryType,
      text: memoryText,
      image: memoryImage ? '[LOCAL_IMAGE]' : placeholderImages[0],
      date: new Date().toLocaleDateString(),
      timestamp
    };
  
    console.log("Saving memory to Firebase:", newMemory);
  
    push(ref(database, 'memories'), newMemory)
      .then(() => {
        console.log("Memory saved in Firebase");
  
        const localImage = memoryImage || placeholderImages[0];
        const withImage = { ...newMemory, image: localImage, id: timestamp.toString() };
        // setMemories(prev => [...prev, withImage]);
      })
      .catch(error => {
        console.error("Error saving memory to Firebase:", error);
      });
  
    setShowMemoryModal(false);
    setMemoryText('');
    setMemoryImage(null);
  };
  
  
 
  // Format timer
  const formatTimer = () => {

    return (
        <>
        {`${timer.months}:${timer.days}:${timer.hours}: ${timer.minutes}:${timer.seconds}`}

        </>
    )       
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f9f9fb] overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      
      {/* Header */}
      <header className="flex items-center p-4 pb-2 justify-between">
        <button onClick={() => nav(-1)} className="flex size-12 items-center text-[#101915]"><ArrowLeft size={24} /></button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#101915]">Gratitude & Respect</h2>
      </header>
      {/* Main Content */}
      <div className="flex-1 p-4">
        
        {/* Impact Section */}
        <Section title="Her Impact">
          <div className="space-y-3">
            <p className="text-[#121019] text-base font-medium">Journey Progress</p>
            <div className="rounded bg-[#d7d3e4]">
              <div className="h-2 rounded bg-[#bcadea]" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[#65578e] text-sm">Engi's guidance has been instrumental in my progress.</p>
          </div>
        </Section>

       

        {/* Journey Stats */}
        <Section title={
          <span className="flex items-center gap-2">
          <ClockFading className="text-[#8d75d4] w-6 h-6" />
          Our Journey
        </span>
        }>
            
          <div className="flex gap-4">
           
            <div>
                 <StatCard title="Total Time" value={formatTimer()} />
                 
                
            </div>
          
            
            <StatCard title="Sessions" value="29" />
          </div>
        </Section>

        {/* About Section */}
        <AboutSection />
      </div>
 {/* Memories Sections */}
        <MemoriesSection 
          title="Memories" 
          memories={memories.filter(m => m.type === 'session')} 
          onMemoryClick={setSelectedMemory}
        />

        <MemoriesSection 
          title="Gratitude Wall" 
          memories={memories.filter(m => m.type === 'gratitude')} 
          onMemoryClick={setSelectedMemory}
          isGratitude
        />
      {/* Add Memory Button */}
      <div className="p-4">
        <button
          onClick={() => setShowMemoryModal(true)}
          className="flex items-center justify-center w-full max-w-md mx-auto bg-[#bcadea] text-[#121019] font-bold py-3 px-6 rounded-full gap-2"
        >
          <PlusIcon />
          Add Memory
        </button>
      </div>

      {/* Modals */}
      {showMemoryModal && (
        <MemoryModal
          memoryType={memoryType}
          setMemoryType={setMemoryType}
          memoryText={memoryText}
          setMemoryText={setMemoryText}
          memoryImage={memoryImage}
          handleImageUpload={handleImageUpload}
          onClose={() => setShowMemoryModal(false)}
          onSave={saveMemory}
        />
      )}

      {selectedMemory && (
        <MemoryDetailModal 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
        />
      )}
    </div>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <div className="mt-6">
    <h2 className="text-[#121019] text-xl font-bold mb-3">{title}</h2>
    {children}
  </div>
);


const MemoriesSection = ({ title, memories, onMemoryClick, isGratitude }) => {
    return (
        <div className="my-10 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>
    
          <div className="flex overflow-x-auto space-x-4 pb-4 px-1 scroll-smooth">
            {memories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => onMemoryClick(memory)}
                className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0"
              >
                <div className="h-40 w-full">
                  <img
                    src={memory.image}
                    alt="memory"
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                </div>
    
                <div className="p-4 bg-gray-50">
                  <div className="border-l-4 border-purple-400 pl-3 mb-3">
                  <p className="text-gray-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">
  “{memory.text.length > 10 ? memory.text.slice(0, 10) + '...' : memory.text}”
</p>
<p className="text-xs italic text-gray-400 mt-2">Tap to view full message</p>

                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="italic">{memory.type}</span>
                    <span>{memory.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };



const StatCard = ({ title, value }) => (
  <div className="flex-1 p-4 border border-[#d7d3e4] rounded-xl">
    <p className="text-[#121019] text-base">{title}</p>
    <p className="text-[#121019] text-2xl font-bold">{value}</p>
  </div>
);

const AboutSection = () => (
  <Section title="About Enji">
    <div className="grid grid-cols-3 gap-15 overflow-x-auto  mb-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="aspect-square bg-gray-200 rounded-xl w-[130px] overflow-x-auto ">
{i === 1 && (
  <img 
    src="/EngiImg/1000079730.jpg"
    alt="Profile photo 1"
    className="w-full h-full object-cover rounded-xl"
  />
)}
{i === 2 && (
  <img 
    src="/EngiImg/494285616_1015545197383494_1141896882451877712_n.jpg"
    alt="Profile photo 2" 
    className="w-full h-full object-cover rounded-xl"
  />
)}
{i === 3 && (
  <img 
    src="/EngiImg/Screenshot_20250506_233858_Facebook[1].jpg"
    alt="Profile photo 3"
    className="w-full h-full object-cover rounded-xl"
  />
)}
        </div>
      ))}
    </div>
    <div className="bg-gradient-to-br from-[#f8f5ff] to-[#eef2ff] p-8 rounded-2xl shadow-lg border border-[#e0d6ff] max-w-2xl mx-auto">
  <div className="mb-6 text-center">
    <h2 className="text-3xl font-bold text-[#4a2c82] mb-2 font-serif">PSY. Engi Okili</h2>
    <div className="w-20 h-1 bg-[#7e5bef] mx-auto rounded-full"></div>
  </div>
  
  <p className="text-[#121019] mb-6 text-lg leading-relaxed">
    A highly qualified mental health professional dedicated to providing compassionate, evidence-based care.
  </p>
  
  <div className="grid md:grid-cols-2 gap-6">
    {/* <!-- Education Column --> */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0ebff]">
      <h3 className="text-xl font-semibold text-[#4a2c82] mb-4 flex items-center">
        <span className="mr-2"> <GraduationCap />  </span> Education
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Master's Degree in Psychology</span>
        </li>
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Bachelor's Degree in Arts</span>
        </li>
      </ul>
    </div>
    
    {/* <!-- Specializations Column --> */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0ebff]">
      <h3 className="text-xl font-semibold text-[#4a2c82] mb-4 flex items-center">
        <span className="mr-2"> <BadgeAlertIcon/> </span> Therapeutic Approaches
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Cognitive Behavioral Therapy (CBT)</span>
        </li>
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Addiction Treatment</span>
        </li>
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Acceptance & Commitment Therapy (ACT)</span>
        </li>
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Dialectical Behavior Therapy (DBT)</span>
        </li>
        <li className="flex items-start">
          <span className="text-[#7e5bef] mr-2">•</span>
          <span>Schema Therapy</span>
        </li>
      </ul>
    </div>
  </div>
  
  {/* <!-- Treatment Expertise --> */}
  <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-[#f0ebff]">
    <h3 className="text-xl font-semibold text-[#4a2c82] mb-4 flex items-center">
      <span className="mr-2"> <HeartHandshake /> </span> Treatment Expertise
    </h3>
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">Generalized & Social Anxiety</span>
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">Schizophrenia</span>
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">Childhood Trauma</span>
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">Sexual Disorders</span>
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">Family Issues</span>
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">PTSD Treatment</span>
      <span className="px-3 py-1 bg-[#f3efff] text-[#4a2c82] rounded-full text-sm">OCD Treatment</span>
    </div>
  </div>
  
  <p className="mt-6 text-[#121019] text-lg leading-relaxed italic bg-[#f8f5ff] p-4 rounded-lg border-l-4 border-[#7e5bef]">
    With extensive experience helping clients overcome mental health challenges through evidence-based therapeutic approaches, PSY. Engi Okili provides compassionate and effective treatment tailored to each individual's needs.
  </p>
</div>
  </Section>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
    <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
  </svg>
);

const MemoryModal = ({
  memoryType,
  setMemoryType,
  memoryText,
  setMemoryText,
  memoryImage,
  handleImageUpload,
  onClose,
  onSave
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-5 w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">Add Memory</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Type</label>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 rounded-lg ${memoryType === 'gratitude' ? 'bg-[#bcadea]' : 'bg-gray-200'}`}
              onClick={() => setMemoryType('gratitude')}
            >
              Gratitude
            </button>
            <button
              className={`flex-1 py-2 rounded-lg ${memoryType === 'session' ? 'bg-[#bcadea]' : 'bg-gray-200'}`}
              onClick={() => setMemoryType('session')}
            >
              Session
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Message *</label>
          <textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg"
          />
          {memoryImage && (
            <img src={memoryImage} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!memoryText.trim()}
            className="px-4 py-2 bg-[#bcadea] text-[#121019] font-bold rounded-lg disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MemoryDetailModal = ({ memory, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-5 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{memory.type === 'gratitude' ? 'Gratitude' : 'Memory'}</h3>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      {memory.image && (
        <img src={memory.image} alt="Memory" className="w-full h-48 object-cover rounded-lg mb-4" />
      )}

      {memory.text && <p className="mb-4">{memory.text}</p>}

      <p className="text-sm text-gray-500">Added on {memory.date}</p>
    </div>
  </div>
);

export default App;