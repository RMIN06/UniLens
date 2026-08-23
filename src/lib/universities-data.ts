export interface University {
  id: string;
  name: string;
  city: string;
  type: 'Public' | 'Private';
  category: string;
  ranking: number | null;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toUniversity(u: Omit<University, 'id'>): University {
  return { ...u, id: slugify(u.name) };
}

const rawUniversities: Omit<University, 'id'>[] = [
  { name: 'Quaid-i-Azam University', city: 'Islamabad', type: 'Public', category: 'General', ranking: 1 },
  { name: 'National University of Sciences and Technology (NUST)', city: 'Islamabad', type: 'Public', category: 'Engineering & IT', ranking: 2 },
  { name: 'Pakistan Institute of Engineering and Applied Sciences (PIEAS)', city: 'Islamabad', type: 'Public', category: 'Engineering & IT', ranking: 3 },
  { name: 'Lahore University of Management Sciences (LUMS)', city: 'Lahore', type: 'Private', category: 'Business & Management', ranking: 4 },
  { name: 'University of the Punjab', city: 'Lahore', type: 'Public', category: 'General', ranking: 5 },
  { name: 'Aga Khan University', city: 'Karachi', type: 'Private', category: 'Medical', ranking: 6 },
  { name: 'University of Karachi', city: 'Karachi', type: 'Public', category: 'General', ranking: 7 },
  { name: 'University of Agriculture, Faisalabad', city: 'Faisalabad', type: 'Public', category: 'Agriculture', ranking: 8 },
  { name: 'COMSATS University Islamabad', city: 'Islamabad', type: 'Public', category: 'Engineering & IT', ranking: 9 },
  { name: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIK)', city: 'Topi', type: 'Private', category: 'Engineering & IT', ranking: 10 },
  { name: 'University of Engineering and Technology, Lahore', city: 'Lahore', type: 'Public', category: 'Engineering & IT', ranking: 11 },
  { name: 'Institute of Business Administration (IBA), Karachi', city: 'Karachi', type: 'Public', category: 'Business & Management', ranking: 12 },
  { name: 'Dow University of Health Sciences', city: 'Karachi', type: 'Public', category: 'Medical', ranking: 13 },
  { name: 'University of Peshawar', city: 'Peshawar', type: 'Public', category: 'General', ranking: 14 },
  { name: 'Bahria University', city: 'Islamabad', type: 'Public', category: 'General', ranking: 15 },
  { name: 'Air University', city: 'Islamabad', type: 'Public', category: 'Engineering & IT', ranking: 16 },
  { name: 'Mehran University of Engineering and Technology', city: 'Jamshoro', type: 'Public', category: 'Engineering & IT', ranking: 17 },
  { name: 'NED University of Engineering and Technology', city: 'Karachi', type: 'Public', category: 'Engineering & IT', ranking: 18 },
  { name: 'International Islamic University, Islamabad', city: 'Islamabad', type: 'Public', category: 'Islamic Studies', ranking: 19 },
  { name: 'King Edward Medical University', city: 'Lahore', type: 'Public', category: 'Medical', ranking: 20 },
  { name: 'University of Health Sciences, Lahore', city: 'Lahore', type: 'Public', category: 'Medical', ranking: 21 },
  { name: 'Habib University', city: 'Karachi', type: 'Private', category: 'Liberal Arts', ranking: 22 },
  { name: 'Forman Christian College', city: 'Lahore', type: 'Private', category: 'Liberal Arts', ranking: 23 },
  { name: 'Institute of Space Technology', city: 'Islamabad', type: 'Public', category: 'Engineering & IT', ranking: 24 },
  { name: 'Pakistan Navy Engineering College (NUST)', city: 'Karachi', type: 'Public', category: 'Engineering & IT', ranking: 25 },
  { name: 'Riphah International University', city: 'Islamabad', type: 'Private', category: 'Medical', ranking: 26 },
  { name: 'University of Central Punjab', city: 'Lahore', type: 'Private', category: 'General', ranking: 27 },
  { name: 'University of Lahore', city: 'Lahore', type: 'Private', category: 'Medical', ranking: 28 },
  { name: 'National University of Computer and Emerging Sciences (FAST-NUCES)', city: 'Islamabad', type: 'Private', category: 'Engineering & IT', ranking: 29 },
  { name: 'Sir Syed CASE Institute of Technology', city: 'Islamabad', type: 'Private', category: 'Engineering & IT', ranking: 30 },
  { name: 'Capital University of Science and Technology', city: 'Islamabad', type: 'Private', category: 'Engineering & IT', ranking: 31 },
  { name: 'Bahauddin Zakariya University', city: 'Multan', type: 'Public', category: 'General', ranking: 32 },
  { name: 'University of Sindh', city: 'Jamshoro', type: 'Public', category: 'General', ranking: 33 },
  { name: 'University of Balochistan', city: 'Quetta', type: 'Public', category: 'General', ranking: 34 },
  { name: 'Hazara University', city: 'Mansehra', type: 'Public', category: 'General', ranking: 35 },
  { name: 'University of Malakand', city: 'Chakdara', type: 'Public', category: 'General', ranking: 36 },
  { name: 'Abdul Wali Khan University Mardan', city: 'Mardan', type: 'Public', category: 'General', ranking: 37 },
  { name: 'Islamia College University, Peshawar', city: 'Peshawar', type: 'Public', category: 'General', ranking: 38 },
  { name: 'Kohat University of Science and Technology', city: 'Kohat', type: 'Public', category: 'General', ranking: 39 },
  { name: 'Gomal University', city: 'Dera Ismail Khan', type: 'Public', category: 'General', ranking: 40 },
  { name: 'Arid Agriculture University, Rawalpindi', city: 'Rawalpindi', type: 'Public', category: 'Agriculture', ranking: 41 },
  { name: 'PMAS Arid Agriculture University', city: 'Rawalpindi', type: 'Public', category: 'Agriculture', ranking: 42 },
  { name: 'University of Veterinary and Animal Sciences, Lahore', city: 'Lahore', type: 'Public', category: 'Agriculture', ranking: 43 },
  { name: 'Government College University, Lahore', city: 'Lahore', type: 'Public', category: 'General', ranking: 44 },
  { name: 'Government College University, Faisalabad', city: 'Faisalabad', type: 'Public', category: 'General', ranking: 45 },
  { name: 'Fatima Jinnah Women University', city: 'Rawalpindi', type: 'Public', category: 'General', ranking: 46 },
  { name: 'Lahore College for Women University', city: 'Lahore', type: 'Public', category: 'General', ranking: 47 },
  { name: 'Kinnaird College for Women', city: 'Lahore', type: 'Public', category: 'Liberal Arts', ranking: 48 },
  { name: 'University of Gujrat', city: 'Gujrat', type: 'Public', category: 'General', ranking: 49 },
  { name: 'University of Sargodha', city: 'Sargodha', type: 'Public', category: 'General', ranking: 50 },
  { name: 'NFC Institute of Engineering and Technology', city: 'Multan', type: 'Public', category: 'Engineering & IT', ranking: 51 },
  { name: 'MNS University of Engineering and Technology, Multan', city: 'Multan', type: 'Public', category: 'Engineering & IT', ranking: 52 },
  { name: 'Khawaja Fareed University of Engineering and Information Technology', city: 'Rahim Yar Khan', type: 'Public', category: 'Engineering & IT', ranking: 53 },
  { name: 'University of Engineering and Technology, Taxila', city: 'Taxila', type: 'Public', category: 'Engineering & IT', ranking: 54 },
  { name: 'University of Engineering and Technology Peshawar', city: 'Peshawar', type: 'Public', category: 'Engineering & IT', ranking: 55 },
  { name: 'CECOS University of IT and Emerging Sciences', city: 'Peshawar', type: 'Private', category: 'Engineering & IT', ranking: 56 },
  { name: 'City University of Science and IT, Peshawar', city: 'Peshawar', type: 'Private', category: 'Engineering & IT', ranking: 57 },
  { name: 'IQRA National University, Peshawar', city: 'Peshawar', type: 'Private', category: 'General', ranking: 58 },
  { name: 'IQRA University, Karachi', city: 'Karachi', type: 'Private', category: 'Business & Management', ranking: 59 },
  { name: 'Ziauddin University', city: 'Karachi', type: 'Private', category: 'Medical', ranking: 60 },
  { name: 'Jinnah Sindh Medical University', city: 'Karachi', type: 'Public', category: 'Medical', ranking: 61 },
  { name: 'Hamdard University', city: 'Karachi', type: 'Private', category: 'General', ranking: 62 },
  { name: 'Indus University, Karachi', city: 'Karachi', type: 'Private', category: 'Engineering & IT', ranking: 63 },
  { name: 'DHA Suffa University', city: 'Karachi', type: 'Private', category: 'Engineering & IT', ranking: 64 },
  { name: 'Usman Institute of Technology', city: 'Karachi', type: 'Private', category: 'Engineering & IT', ranking: 65 },
  { name: 'Paf-Kiet (Pakistan Air Force Karachi Institute of Economics and Technology)', city: 'Karachi', type: 'Private', category: 'Engineering & IT', ranking: 66 },
  { name: 'Muhammad Ali Jinnah University', city: 'Karachi', type: 'Private', category: 'Business & Management', ranking: 67 },
  { name: 'Shaheed Zulfikar Ali Bhutto Institute of Science and Technology (SZABIST)', city: 'Karachi', type: 'Private', category: 'Engineering & IT', ranking: 68 },
  { name: 'Textile Institute of Pakistan', city: 'Karachi', type: 'Private', category: 'Art & Design', ranking: 69 },
  { name: 'Indus Valley School of Art and Architecture', city: 'Karachi', type: 'Private', category: 'Art & Design', ranking: 70 },
  { name: 'National College of Arts', city: 'Lahore', type: 'Public', category: 'Art & Design', ranking: 71 },
  { name: 'Beaconhouse National University', city: 'Lahore', type: 'Private', category: 'Liberal Arts', ranking: 72 },
  { name: 'Institute for Art and Culture', city: 'Lahore', type: 'Private', category: 'Art & Design', ranking: 73 },
  { name: 'University of South Asia', city: 'Lahore', type: 'Private', category: 'General', ranking: 74 },
  { name: 'Superior University', city: 'Lahore', type: 'Private', category: 'Business & Management', ranking: 75 },
  { name: 'Lahore Garrison University', city: 'Lahore', type: 'Public', category: 'General', ranking: 76 },
  { name: 'Minhaj University', city: 'Lahore', type: 'Private', category: 'Islamic Studies', ranking: 77 },
  { name: 'University of Chenab', city: 'Gujrat', type: 'Private', category: 'General', ranking: 78 },
  { name: 'CUST (Capital University of Science & Technology)', city: 'Islamabad', type: 'Private', category: 'Engineering & IT', ranking: 79 },
  { name: 'Foundation University, Islamabad', city: 'Islamabad', type: 'Private', category: 'General', ranking: 80 },
  { name: 'Federal Urdu University of Arts, Sciences and Technology', city: 'Islamabad', type: 'Public', category: 'General', ranking: 81 },
  { name: 'Shifa Tameer-e-Millat University', city: 'Islamabad', type: 'Private', category: 'Medical', ranking: 82 },
  { name: 'National University of Medical Sciences (NUMS)', city: 'Rawalpindi', type: 'Public', category: 'Medical', ranking: 83 },
  { name: 'Rawalpindi Medical University', city: 'Rawalpindi', type: 'Public', category: 'Medical', ranking: 84 },
  { name: 'Wah Medical College (NUST)', city: 'Wah Cantt', type: 'Public', category: 'Medical', ranking: 85 },
  { name: 'Military College of Signals (NUST)', city: 'Rawalpindi', type: 'Public', category: 'Engineering & IT', ranking: 86 },
  { name: 'Bilquis Postgraduate College / Air University', city: 'Rawalpindi', type: 'Public', category: 'General', ranking: 87 },
  { name: 'Fazaia Medical College (Air University)', city: 'Islamabad', type: 'Public', category: 'Medical', ranking: 88 },
  { name: 'Khyber Medical University', city: 'Peshawar', type: 'Public', category: 'Medical', ranking: 89 },
  { name: 'Rehman Medical Institute / RMI-UTAS', city: 'Peshawar', type: 'Private', category: 'Medical', ranking: 90 },
  { name: 'Abbottabad University of Science and Technology', city: 'Abbottabad', type: 'Public', category: 'General', ranking: 91 },
  { name: 'COMSATS University Islamabad, Wah Campus', city: 'Wah Cantt', type: 'Public', category: 'Engineering & IT', ranking: 92 },
  { name: 'Mirpur University of Science and Technology (MUST)', city: 'Mirpur AJK', type: 'Public', category: 'Engineering & IT', ranking: 93 },
  { name: 'University of Azad Jammu and Kashmir', city: 'Muzaffarabad', type: 'Public', category: 'General', ranking: 94 },
  { name: 'Balochistan University of IT, Engineering and Management Sciences (BUITEMS)', city: 'Quetta', type: 'Public', category: 'Engineering & IT', ranking: 95 },
  { name: 'Sardar Bahadur Khan Women University', city: 'Quetta', type: 'Public', category: 'General', ranking: 96 },
  { name: 'Lasbela University of Agriculture, Water and Marine Sciences', city: 'Uthal', type: 'Public', category: 'Agriculture', ranking: 97 },
  { name: 'Shah Abdul Latif University', city: 'Khairpur', type: 'Public', category: 'General', ranking: 98 },
  { name: 'Benazir Bhutto Shaheed University Lyari', city: 'Karachi', type: 'Public', category: 'General', ranking: 99 },
  { name: 'Nazeer Hussain University', city: 'Karachi', type: 'Private', category: 'Engineering & IT', ranking: 100 },
];

export const topPakistaniUniversities: University[] = rawUniversities.map(toUniversity);
