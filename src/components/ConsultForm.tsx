"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';


// Add course and state data
const courses = [
  { label: "BBA", value: "BBA" },
  { label: "BCA", value: "BCA" },
  { label: "B.Com", value: "B.Com" },
  { label: "MBA", value: "MBA" },
  { label: "MCA", value: "MCA" },
  { label: "M.Com", value: "M.Com" },
  { label: "BA", value: "BA" },
  { label: "MA", value: "MA" },
  { label: "M.Sc", value: "M.Sc" },
  { label: "MJMC", value: "MJMC" },
  { label: "PhD", value: "PhD" },
  { label: "B.Sc", value: "B.Sc" },
  { label: "Diploma", value: "Diploma" },
  { label: "BPT", value: "BPT" },
  { label: "B.Lib", value: "B.Lib" },
  { label: "B.Tech", value: "B.Tech" },
  { label: "B.Lis", value: "B.Lis" },
  { label: "B.Ed", value: "B.Ed" },
  { label: "BFA", value: "BFA" },
  { label: "MSW", value: "MSW" },
  { label: "B.Pharma", value: "BPHARMA" },
  { label: "BPP", value: "BPP" },
  { label: "BSW", value: "BSW" },
  { label: "Certificate", value: "CERTIFICATE" },
  { label: "DBA", value: "DBA" },
  { label: "D.Pharma", value: "DPHARMA" },
  { label: "BMM", value: "BMM" },
  { label: "BAM", value: "BAM" },
  { label: "M.Lib", value: "M.LIB" },
  { label: "M.Tech", value: "M.TECH" },
  { label: "MFA", value: "MFA" },
  { label: "MPhil", value: "MPHIL" },
  { label: "MPT", value: "MPT" },
  { label: "NTT", value: "NTT" },
  { label: "MBBS", value: "MBBS" },
  { label: "BHM", value: "BHM" },
  { label: "BHMS", value: "BHMS" },
  { label: "M.Pharm", value: "M.Pharm" },
  { label: "BVSc", value: "BVSc" },
  { label: "M.Planning", value: "M.Planning" },
  { label: "BUMS", value: "BUMS" },
  { label: "MHA", value: "MHA" },
  { label: "D.Litt", value: "D.Litt" },
  { label: "M.Arch", value: "M.Arch" },
  { label: "B.Planning", value: "B.Planning" },
  { label: "MDS", value: "MDS" },
  { label: "M.Ed", value: "M.Ed" },
  { label: "B.Voc", value: "B.Voc" },
  { label: "Others", value: "Others" },
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "LLB", value: "LLB" },
  { label: "Vocational", value: "Vocational" },
  { label: "PGDT", value: "PGDT" },
  { label: "PGDY", value: "PGDY" },
  { label: "PGDCA", value: "PGDCA" },
  { label: "PGDC", value: "PGDC" },
  { label: "PGDCLP", value: "PGDCLP" },
  { label: "PGDIPL", value: "PGDIPL" },
  { label: "PGDHR", value: "PGDHR" },
  { label: "PGDAHL", value: "PGDAHL" },
  { label: "PGDBL", value: "PGDBL" },
  { label: "PGDFS", value: "PGDFS" },
  { label: "PGDCL", value: "PGDCL" },
  { label: "PGDLL", value: "PGDLL" },
  { label: "DCLT", value: "DCLT" },
  { label: "DCCM", value: "DCCM" },
  { label: "D LIB", value: "D LIB" },
  { label: "DDM", value: "DDM" },
  { label: "DY", value: "DY" },
  { label: "DDAH", value: "DDAH" },
  { label: "DTH", value: "DTH" },
  { label: "DBFSB", value: "DBFSB" },
  { label: "DAOTT", value: "DAOTT" },
  { label: "DO", value: "DO" },
  { label: "DMT", value: "DMT" },
  { label: "DXRT", value: "DXRT" },
  { label: "DNYS", value: "DNYS" },
  { label: "DMLT", value: "DMLT" },
  { label: "DMIT", value: "DMIT" },
  { label: "DJMC", value: "DJMC" },
  { label: "DHMCT", value: "DHMCT" },
  { label: "DHA", value: "DHA" },
  { label: "DFA", value: "DFA" },
  { label: "DEEE", value: "DEEE" },
  { label: "DCA", value: "DCA" },
  { label: "DSM", value: "DSM" },
  { label: "DFD", value: "DFD" },
  { label: "DPES", value: "DPES" },
  { label: "DAP", value: "DAP" },
  { label: "DTA", value: "DTA" },
  { label: "DDA", value: "DDA" },
  { label: "DDT", value: "DDT" },
  { label: "DCT", value: "DCT" },
  { label: "DCCT", value: "DCCT" },
  { label: "DOAT", value: "DOAT" },
  { label: "DR", value: "DR" },
  { label: "DP", value: "DP" },
  { label: "DHSI", value: "DHSI" },
  { label: "DA", value: "DA" },
  { label: "DECE", value: "DECE" },
  { label: "DME", value: "DME" },
  { label: "DEE", value: "DEE" },
  { label: "DCSE", value: "DCSE" },
  { label: "DCE", value: "DCE" },
  { label: "DHM", value: "DHM" },
  { label: "DC", value: "DC" },
  { label: "DCLP", value: "DCLP" },
  { label: "DIPL", value: "DIPL" },
  { label: "DHR", value: "DHR" },
  { label: "DAHL", value: "DAHL" },
  { label: "DBL", value: "DBL" },
  { label: "DFS", value: "DFS" },
  { label: "DCL", value: "DCL" },
  { label: "DLL", value: "DLL" },
  { label: "CY", value: "CY" },
  { label: "CCC", value: "CCC" },
  { label: "CGD", value: "CGD" },
  { label: "CWD", value: "CWD" },
  { label: "CCF", value: "CCF" },
  { label: "CBW", value: "CBW" },
  { label: "CDM", value: "CDM" },
  { label: "CHM", value: "CHM" },
  { label: "ADVS", value: "ADVS" },
  { label: "Certificate Programs", value: "Certificate Programs" },
  { label: "PG DIPLOMA", value: "PG DIPLOMA" },
  { label: "Advance Diploma", value: "Advance Diploma" },
  { label: "Masters Degree", value: "Masters Degree" },
  { label: "Bachelors Degree", value: "Bachelors Degree" },
  { label: "MPH", value: "MPH" },
  { label: "MPES", value: "MPES" },
  { label: "MHM", value: "MHM" },
  { label: "MFM", value: "MFM" },
  { label: "MBA Part Time", value: "MBA Part Time" },
  { label: "MBA Dual", value: "MBA Dual" },
  { label: "M.Voc", value: "M.Voc" },
  { label: "M.Design", value: "M.Design" },
  { label: "BSC HONS", value: "BSC HONS" },
  { label: "BPEd", value: "BPEd" },
  { label: "BMLT", value: "BMLT" },
  { label: "BJMC", value: "BJMC" },
  { label: "Executive MBA", value: "Executive MBA" },
  { label: "E-MBA", value: "E-MBA" },
  { label: "CCH", value: "CCH" }
];

const educationMode = [
  { label: "Regular", value: "Regular" },
  { label: "Distance", value: "Distance" },
  { label: "Online", value: "Online" },
  { label: "Vocational", value: "Vocational" },
];

const selectClassNames = {
  label: "text-blue-100",
  trigger: [
    "bg-blue-50/10",
    "backdrop-blur-md",
    "text-white",
    "hover:bg-blue-50/20",
    "focus-within:bg-blue-50/20",
    "placeholder:text-blue-200/50",
    "hover:placeholder:text-yellow-600/80",
    "focus:placeholder:text-yellow-600/90",
  ].join(" "),
  value: "text-white",
  base: "border border-transparent focus-within:border-yellow-400",
  // Add higher z-index to ensure dropdown appears above other elements
  listbox: "z-[200] bg-white",
  popover: "z-[200]", 
};

interface ConsultFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClassNames = {
  label: "text-blue-100",
  input: [
    "bg-transparent",
    "text-white",
    "placeholder:text-blue-200/50",
    "focus:placeholder:text-yellow-600/90", // Changed to yellow with high opacity
    "hover:placeholder:text-yellow-600/80", // Changed to yellow with slightly lower opacity
    "focus:ring-0",
    "focus:ring-offset-0",
    "text-base", // Ensure text is at least 16px to prevent zoom
  ].join(" "),
  inputWrapper: [
    "bg-blue-50/10",
    "backdrop-blur-md",
    "hover:bg-blue-50/20",
    "group-focus-within:bg-blue-50/20",
  ].join(" "),
  innerWrapper: "bg-transparent",
  base: "group",
  mainWrapper: [
    "border",
    "border-transparent",
    "focus-within:border-yellow-400",
    "bg-transparent",
  ].join(" "),
};

const phoneInputClassNames = {
  ...inputClassNames,
  input: [
    ...inputClassNames.input.split(" "),
    "bg-white",
    "pl-[80px]", // Increased from 70px to 80px
    "text-base", // Ensure text is at least 16px
  ].join(" "),
  innerWrapper: [
    "bg-transparent",
    "gap-3", // Added gap between prefix and input
  ].join(" ")
};

export default function ConsultForm({ isOpen, onClose }: ConsultFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    educationMode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add refs for tracking active input and form
  const formRef = useRef<HTMLFormElement>(null);
  const activeInputRef = useRef<HTMLElement | null>(null);
  
  // Track keyboard visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Enhanced keyboard detection using VisualViewport API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;
    
    const handleResize = () => {
      // Detect if keyboard is likely open (viewport height significantly reduced)
      const windowHeight = window.innerHeight;
      const viewportHeight = visualViewport.height;
      
      // If viewport height is less than 70% of window height, keyboard is likely open
      const isKeyboardOpen = viewportHeight < windowHeight * 0.7;
      setKeyboardVisible(isKeyboardOpen);
      
      // When keyboard opens, scroll active input into view
      if (isKeyboardOpen && activeInputRef.current) {
        setTimeout(() => {
          activeInputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
    };
    
    visualViewport.addEventListener('resize', handleResize);
    return () => visualViewport.removeEventListener('resize', handleResize);
  }, []);
  
  // Enhanced focus handling to track active input
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Set a short delay to avoid conflicts with dropdown opening
    setTimeout(() => {
      activeInputRef.current = e.target;
      
      // Only scroll if keyboard is visible
      if (keyboardVisible) {
        setTimeout(() => {
          if (activeInputRef.current) {
            activeInputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 300);
      }
    }, 50);
  };
  
  // Reset active input on blur
  const handleBlur = () => {
    activeInputRef.current = null;
  };

  // Improved click outside handler with better mobile support
  useEffect(() => {
    if (!isDropdownOpen) return;
    
    // Updated handler with union type to support both event types
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listeners with correct typings
    document.addEventListener('mousedown', handleClickOutside as EventListener, true);
    document.addEventListener('touchstart', handleClickOutside as EventListener, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener, true);
      document.removeEventListener('touchstart', handleClickOutside as EventListener, true);
    };
  }, [isDropdownOpen]);

  const filteredCourses = courses.filter(course =>
    course.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Limit to 10 digits
    if (value.length <= 10) {
      setFormData(prev => ({
        ...prev,
        phone: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', course: '', educationMode: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add some CSS to the document to prevent zoom on focus
  useEffect(() => {
    if (typeof document !== 'undefined' && isOpen) {
      // Create a style element
      const style = document.createElement('style');
      style.id = 'prevent-zoom-style';
      style.innerHTML = `
        input, select, textarea {
          font-size: 16px !important; /* Prevents iOS zoom */
        }
        .prevent-zoom {
          touch-action: manipulation;
        }
      `;
      document.head.appendChild(style);

      return () => {
        // Clean up on close
        const existingStyle = document.getElementById('prevent-zoom-style');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      backdrop="blur"
      hideCloseButton
      // Make modal positioning better for mobile
      classNames={{
        base: "sm:my-16", 
        wrapper: "items-end sm:items-center prevent-zoom", // Added prevent-zoom class
        body: "p-0",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              overflow-visible
              rounded-t-2xl sm:rounded-2xl
              ${keyboardVisible ? 'max-h-[60vh]' : ''} 
              prevent-zoom
            `}
          >
            <ModalBody className="p-0 relative overflow-visible prevent-zoom">
              {/* Add custom close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 transition-all duration-300 transform hover:scale-110"
              >
                ✕
              </button>
              
              <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 sm:p-8 rounded-t-2xl sm:rounded-2xl overflow-visible">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
                    Get Expert Consultation
                  </h2>
                  <p className="text-blue-100 text-sm mt-3">
                    Take the first step towards your future with personalized guidance
                  </p>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 text-red-700 rounded"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-green-100 border-l-4 border-green-500 p-4 mb-4 text-green-700 rounded"
                  >
                    Thanks! We'll contact you soon.
                  </motion.div>
                )}

                <form 
                  ref={formRef}
                  onSubmit={handleSubmit} 
                  className="space-y-4 overflow-visible prevent-zoom"
                >
                  <div className="space-y-4 overflow-visible">
                    <Input
                      type="text"
                      label="Name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      classNames={inputClassNames}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <Input
                      type="email"
                      label="Email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      classNames={inputClassNames}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    <Input
                      type="tel"
                      label="Phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handlePhoneInput}
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      startContent={
                        <div className="flex items-center pointer-events-none">
                          <Image
                            src="/in.png"
                            width={20}
                            height={15}
                            alt="India"
                            className="mr-1"
                          />
                          <span className="text-blue-200">+91</span>
                        </div>
                      }
                      classNames={phoneInputClassNames}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />

                    {/* Custom Course Dropdown - Modified for mobile */}
                    <div className="relative z-[100] overflow-visible">
                      <div ref={dropdownRef} className="relative">
                        <label className="text-blue-100 text-sm mb-1.5 block">Course</label>
                        <div
                          className="bg-blue-50/10 backdrop-blur-md text-white hover:bg-blue-50/20 rounded-lg p-2 cursor-pointer flex justify-between items-center border border-transparent focus-within:border-yellow-400"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          tabIndex={0}
                          onFocus={() => {
                            activeInputRef.current = document.activeElement as HTMLElement;
                          }}
                          onBlur={handleBlur}
                        >
                          <span className={formData.course ? "text-white" : "text-blue-200/50"}>
                            {formData.course ? courses.find(c => c.value === formData.course)?.label : "Select your course"}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Positioned dropdown with improved overlay for catching clicks */}
                        {isDropdownOpen && (
                          <>
                            {/* This overlay will catch clicks outside dropdown */}
                            <div 
                              className="fixed inset-0 z-[90]" 
                              onClick={() => setIsDropdownOpen(false)}
                            />
                            
                            <div className={`
                              absolute z-[100] w-full bg-white rounded-lg shadow-xl
                              ${keyboardVisible || typeof window !== 'undefined' && window.innerWidth <= 768 ? 'top-full' : 'bottom-full'}
                              ${keyboardVisible || typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mt-1' : 'mb-1'}
                              max-h-36 sm:max-h-60
                              overflow-auto
                            `}>
                              <div className="sticky top-0 bg-white p-2 border-b">
                                <input
                                  type="text"
                                  placeholder="Search courses..."
                                  className="w-full p-2 border rounded-md text-sm bg-gray-50"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onFocus={handleFocus}
                                  onBlur={handleBlur}
                                />
                              </div>
                              <div className="py-1">
                                {filteredCourses.map((course) => (
                                  <div
                                    key={course.value}
                                    className={`px-4 py-3 cursor-pointer hover:bg-blue-50 ${
                                      formData.course === course.value ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                    }`}
                                    onClick={() => {
                                      setFormData({ ...formData, course: course.value });
                                      setIsDropdownOpen(false);
                                      setSearchQuery("");
                                    }}
                                  >
                                    {course.label}
                                  </div>
                                ))}
                                {/* ...existing empty state... */}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Education Mode dropdown with improved mobile handling */}
                    <div className="relative z-[200] overflow-visible">
                      <Select
                        label="Education Mode"
                        placeholder="Select your Education Mode"
                        value={formData.educationMode}
                        onChange={(e) => setFormData({ ...formData, educationMode: e.target.value })}
                        required
                        classNames={selectClassNames}
                        onFocus={() => {
                          // Clear active input to prevent scroll interference
                          activeInputRef.current = null;
                        }}
                        onBlur={handleBlur}
                        // Add popover props to ensure proper positioning
                        popoverProps={{
                          placement: "bottom",
                          offset: 5,
                          classNames: {
                            base: "z-[200]" // Ensure high z-index
                          }
                        }}
                      >
                        {educationMode.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Sticky button for better mobile access */}
                  <div className="sticky bottom-0 pt-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 rounded-xl shadow-lg transition-all duration-300 text-lg"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Get Free Consultation"}
                    </Button>
                  </div>
                </form>
              </div>
            </ModalBody>
          </motion.div>
        </AnimatePresence>
      </ModalContent>
    </Modal>
  );
}
