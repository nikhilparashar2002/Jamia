"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";

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

export default function VideoConsultForm() {
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

   // Close dropdown when clicking outside
   useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const filteredCourses = courses.filter(course =>
    course.label.toLowerCase().includes(searchQuery.toLowerCase())
  );


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

  return (
    <div className="mx-auto " style={{ maxWidth: "359.99px" }}>
      <div className="bg-[#003366] p-6 rounded-lg w-full">
        <div className="text-center mb-6">
          <p className="text-yellow-400 text-2xl font-bold">
          Need Guidance? Speak to an Expert for Free!
          </p>
          <p className="text-white text-sm mt-2">
            Fill the form below and get more information on Jamia Hamdard University.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-500 text-sm mt-2 text-center">
            Form submitted successfully! We'll contact you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            classNames={{
              label: "text-white",
              input: "bg-white",
            }}
          />

          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            classNames={{
              label: "text-white",
              input: "bg-white",
            }}
          />

          <Input
            type="tel"
            label="Phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            startContent={
              <div className="flex items-center pointer-events-none min-w-[60px]">
                <Image
                                            src="/in.png"
                                            width={20}
                                            height={15}
                                            alt="India"
                                            className="mr-1"
                                          />
                <span className="text-default-400">+91</span>
              </div>
            }
            classNames={{
              label: "text-white",
              input: "bg-white pl-[70px]",
              inputWrapper: "bg-white",
            }}
          />

         {/* Custom Course Dropdown */}
         <div ref={dropdownRef} className="relative z-[100]"> {/* Added z-index here */}
            <div className="text-white text-sm mb-1.5">Course</div>
            <div
              className="bg-white rounded-lg p-2 cursor-pointer flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={formData.course ? "text-black" : "text-gray-400"}>
                {formData.course ? courses.find(c => c.value === formData.course)?.label : "Select a course"}
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

            {/* Updated Dropdown Content with backdrop */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[90]" /> {/* Invisible overlay to catch clicks */}
                <div className="absolute z-[100] mt-1 w-full bg-white rounded-lg shadow-xl max-h-60 overflow-auto">
                  <div className="sticky top-0 bg-white p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="w-full p-2 border rounded-md text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="py-1">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.value}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
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
                    {filteredCourses.length === 0 && (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No courses found
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>


          <Select
            label="Education Mode"
            placeholder="Select your state"
            value={formData.educationMode}
            onChange={(e) =>
              setFormData({ ...formData, educationMode: e.target.value })
            }
            required
            classNames={{
              label: "text-white",
              trigger: "bg-white",
            }}
          >
            {educationMode.map((educationMode) => (
              <SelectItem key={educationMode.value} value={educationMode.value}>
                {educationMode.label}
              </SelectItem>
            ))}
          </Select>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
          </Button>
        </form>
      </div>
    </div>
  );
}
