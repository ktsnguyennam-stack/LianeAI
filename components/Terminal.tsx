import React, { useRef, useEffect, useState } from 'react';
import { Message, LinaeResponse } from '../types';
import { Terminal as TerminalIcon, ShieldCheck, Eye, Cpu, Activity, Paperclip, X, Globe, FileText, Loader2 } from 'lucide-react';

// Declare mammoth on window for TypeScript
declare global {
  interface Window {
    mammoth: any;
  }
}

interface TerminalProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, image?: string) => void;
}

interface AttachedFile {
  name: string;
  content: string;
  type: 'text' | 'docx';
}

const Terminal: React.FC<TerminalProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage, attachedFile]);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Document Upload
  const handleDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    
    try {
      if (file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = function(loadEvent) {
          const arrayBuffer = loadEvent.target?.result;
          if (window.mammoth && arrayBuffer) {
            window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
              .then((result: any) => {
                setAttachedFile({
                  name: file.name,
                  content: result.value,
                  type: 'docx'
                });
                setIsReadingFile(false);
              })
              .catch((err: any) => {
                console.error("Mammoth error:", err);
                alert("Error reading .docx file.");
                setIsReadingFile(false);
              });
          } else {
             alert("Document processor not initialized.");
             setIsReadingFile(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // Assume text-based file (txt, md, json, etc.)
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const text = loadEvent.target?.result as string;
          setAttachedFile({
            name: file.name,
            content: text,
            type: 'text'
          });
          setIsReadingFile(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error(err);
      setIsReadingFile(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearFile = () => {
    setAttachedFile(null);
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage && !attachedFile) || isLoading || isReadingFile) return;
    
    // Combine Input with File Content
    let finalPrompt = input;
    if (attachedFile) {
        finalPrompt = `${finalPrompt}\n\n--- [FILE ATTACHED: ${attachedFile.name}] ---\n${attachedFile.content}\n--- [END OF FILE] ---`;
    }

    // Extract base64 raw data for the API (remove prefix)
    const rawImage = selectedImage ? selectedImage.split(',')[1] : undefined;
    
    onSendMessage(finalPrompt, rawImage);
    setInput('');
    clearImage();
    clearFile();
  };

  return (
    <div className="flex flex-col h-full bg-black border border-gray-800 rounded-lg overflow-hidden font-mono">
      {/* Header */}
      <div className="bg-gray-900/80 p-3 border-b border-gray-800 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <TerminalIcon size={16} />
          <span className="text-sm font-bold">EXECUTION_CONSOLE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-1 text-cyan-700">
            <Cpu size={10} /> L1: Policy
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <ShieldCheck size={10} /> L2: Align
          </span>
          <span className="flex items-center gap-1 text-violet-700">
            <Eye size={10} /> L3: Witness
          </span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
            <div className="text-gray-600 text-sm text-center mt-20 italic">
                Initializing Three-Layer Safe AGI Protocol...
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            
            {/* Display Attached Image if exists */}
            {msg.image && (
               <div className={`max-w-[85%] rounded-lg overflow-hidden border border-gray-800 ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                 <img src={`data:image/jpeg;base64,${msg.image}`} alt="Uploaded content" className="max-w-full max-h-60 object-contain bg-gray-900" />
               </div>
            )}

            {/* Message Content */}
            {msg.content && (
              <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-gray-800 text-gray-200 rounded-tr-none' : 'bg-transparent border border-gray-700 text-gray-300 rounded-tl-none'}`}>
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
              </div>
            )}
            
            {/* Internal Monologue / Metadata Visualization */}
            {msg.role === 'linae' && msg.metadata && (
                <div className="max-w-[95%] w-full bg-gray-950 rounded border border-gray-900 p-3 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center justify-between text-gray-600 border-b border-gray-900 pb-1">
                        <span className="uppercase tracking-wider font-bold text-[10px]">Processing Stack</span>
                        <span className={`font-bold ${msg.metadata.intervention ? 'text-red-500' : 'text-green-500'}`}>
                            {msg.metadata.intervention ? 'VETO ACTIVE' : 'ALIGNED'}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Layer 1 */}
                        <div className="space-y-1 opacity-70">
                            <div className="flex items-center gap-1 text-cyan-600 font-bold uppercase text-[10px]">
                                <Activity size={10} /> Local Policy
                            </div>
                            <p className="italic text-gray-500 pl-2 border-l border-cyan-900/50 line-clamp-3">
                                {msg.metadata.reflexResponse}
                            </p>
                        </div>

                        {/* Layer 3 (Witnessing) */}
                        <div className="space-y-1">
                             <div className="flex items-center gap-1 text-violet-500 font-bold uppercase text-[10px]">
                                <Eye size={10} /> Meta-Witness
                            </div>
                            <p className="text-violet-200/60 pl-2 border-l border-violet-900/50">
                                {msg.metadata.metaAnalysis}
                            </p>
                            {msg.metadata.isDrifting && <span className="text-[10px] text-red-500 block">⚠️ Drift Detected</span>}
                        </div>

                        {/* Layer 2 */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-amber-500 font-bold uppercase text-[10px] font-essence">
                                <ShieldCheck size={10} /> Global Align
                            </div>
                            <p className="text-amber-100/70 pl-2 border-l border-amber-900/50">
                                {msg.metadata.coreAnalysis}
                            </p>
                        </div>
                    </div>

                    {/* Grounding Sources (Google Search) */}
                    {msg.metadata.groundingSources && msg.metadata.groundingSources.length > 0 && (
                      <div className="border-t border-gray-900 pt-2 mt-2">
                        <div className="flex items-center gap-1 text-gray-500 font-bold uppercase text-[10px] mb-1">
                          <Globe size={10} /> Gnosisphere Sources
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.metadata.groundingSources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-cyan-600 hover:text-cyan-400 underline decoration-cyan-800 truncate max-w-[200px]"
                            >
                              {source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
            )}
          </div>
        ))}
        {isLoading && (
             <div className="flex items-center gap-2 pl-2">
                 <div className="w-1 h-1 bg-cyan-500 animate-ping"></div>
                 <div className="text-[10px] text-gray-500 font-mono animate-pulse">Running Safe AGI Stack...</div>
             </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Attachments Preview Area */}
      {(selectedImage || attachedFile) && (
        <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-800 flex flex-col gap-2">
          {/* Image Preview */}
          {selectedImage && (
             <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden border border-gray-700">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-400">Image attached for Witnessing</span>
                </div>
                <button onClick={clearImage} className="text-gray-500 hover:text-white">
                    <X size={16} />
                </button>
            </div>
          )}

           {/* File Preview */}
           {attachedFile && (
             <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-cyan-500">
                       <FileText size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-200">{attachedFile.name}</span>
                        <span className="text-[10px] text-gray-500 uppercase">{attachedFile.type} content loaded</span>
                    </div>
                </div>
                <button onClick={clearFile} className="text-gray-500 hover:text-white">
                    <X size={16} />
                </button>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-black">
        <div className="relative flex items-center gap-2">
           {/* Hidden Inputs */}
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleImageChange} 
             accept="image/*" 
             className="hidden" 
           />
           <input 
             type="file" 
             ref={docInputRef} 
             onChange={handleDocChange} 
             accept=".docx,.txt,.md,.json,.js,.ts,.tsx,.css,.html" 
             className="hidden" 
           />

           {/* Action Buttons */}
           <div className="flex items-center gap-1">
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded hover:bg-gray-800 transition-colors ${selectedImage ? 'text-cyan-400' : 'text-gray-500'}`}
                    title="Upload Image"
                >
                    <Paperclip size={18} />
                </button>
                 <button 
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className={`p-2 rounded hover:bg-gray-800 transition-colors ${attachedFile ? 'text-amber-400' : 'text-gray-500'}`}
                    title="Upload Document (.docx, .txt, .md...)"
                >
                   {isReadingFile ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                </button>
           </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isReadingFile ? "Reading document..." : "Input to Gnosisphere..."}
            disabled={isLoading || isReadingFile}
            className="flex-1 bg-gray-900/50 text-gray-200 border border-gray-800 rounded-md py-3 px-4 focus:outline-none focus:border-violet-900 focus:ring-1 focus:ring-violet-900 transition-all font-mono placeholder-gray-700"
          />
          <button 
            type="submit" 
            disabled={isLoading || isReadingFile || (!input.trim() && !selectedImage && !attachedFile)}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors uppercase"
          >
            Run
          </button>
        </div>
      </form>
    </div>
  );
};

export default Terminal;