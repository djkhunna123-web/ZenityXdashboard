export interface ClassQuestion {
  id: string;
  question: string;
}

export interface ClassData {
  id: string;
  classNumber: string;
  teacherName: string;
  courseName: string;
  date: string;
  responseCount: number;
  avgSatisfaction: number;
  avgRecommend: number;
  customQuestions: ClassQuestion[];
}

export interface FeedbackData {
  id: string;
  classId: string;
  satisfaction: number;
  recommend: number;
  comment: string;
  studentName: string | null;
  anonymous: boolean;
  createdAt: string;
}

export const mockClasses: ClassData[] = [
  { id: "cls-101", classNumber: "101", teacherName: "ดร. สมหญิง จันทร์เพ็ญ", courseName: "พื้นฐาน Machine Learning", date: "2026-03-01", responseCount: 32, avgSatisfaction: 8.7, avgRecommend: 9.1, customQuestions: [{ id: "q1", question: "เนื้อหาเข้าใจง่ายหรือไม่?" }] },
  { id: "cls-102", classNumber: "102", teacherName: "อ. ธนกร วงศ์สกุล", courseName: "Deep Learning เบื้องต้น", date: "2026-03-03", responseCount: 28, avgSatisfaction: 7.9, avgRecommend: 8.2, customQuestions: [] },
  { id: "cls-103", classNumber: "103", teacherName: "ดร. สมหญิง จันทร์เพ็ญ", courseName: "การประมวลผลภาษาธรรมชาติ", date: "2026-03-05", responseCount: 25, avgSatisfaction: 9.2, avgRecommend: 9.5, customQuestions: [{ id: "q2", question: "ต้องการให้เพิ่มเนื้อหาส่วนใด?" }, { id: "q3", question: "ระดับความยากเหมาะสมหรือไม่?" }] },
  { id: "cls-104", classNumber: "104", teacherName: "ดร. อัญญา ปาเทล", courseName: "เวิร์คช็อป Computer Vision", date: "2026-03-06", responseCount: 30, avgSatisfaction: 8.4, avgRecommend: 8.8, customQuestions: [] },
  { id: "cls-105", classNumber: "105", teacherName: "อ. ธนกร วงศ์สกุล", courseName: "จริยธรรม AI และสังคม", date: "2026-03-08", responseCount: 18, avgSatisfaction: 7.5, avgRecommend: 7.8, customQuestions: [{ id: "q4", question: "หัวข้อที่สนใจมากที่สุดคืออะไร?" }] },
];

export const mockFeedback: FeedbackData[] = [
  { id: "fb-1", classId: "cls-101", satisfaction: 9, recommend: 10, comment: "คลาสยอดเยี่ยม! แบบฝึกหัดภาคปฏิบัติช่วยให้เข้าใจได้ดีมาก", studentName: null, anonymous: true, createdAt: "2026-03-01T14:30:00" },
  { id: "fb-2", classId: "cls-101", satisfaction: 8, recommend: 9, comment: "เนื้อหาดีมาก แต่อยากให้เพิ่มตัวอย่างจากโลกจริงมากขึ้น", studentName: "อเล็กซ์", anonymous: false, createdAt: "2026-03-01T15:00:00" },
  { id: "fb-3", classId: "cls-102", satisfaction: 7, recommend: 8, comment: "ความเร็วในการสอนดี แต่บางหัวข้อยากเกินไปสำหรับผู้เริ่มต้น", studentName: null, anonymous: true, createdAt: "2026-03-03T16:00:00" },
  { id: "fb-4", classId: "cls-103", satisfaction: 10, recommend: 10, comment: "ดร. สมหญิง สอนได้เยี่ยมมาก! คลาสดีที่สุดที่เคยเรียนที่ ZenityX!", studentName: "มิอา", anonymous: false, createdAt: "2026-03-05T13:00:00" },
  { id: "fb-5", classId: "cls-104", satisfaction: 8, recommend: 9, comment: "ชอบรูปแบบเวิร์คช็อปมาก อยากให้มีเซสชันแบบนี้อีก", studentName: null, anonymous: true, createdAt: "2026-03-06T17:00:00" },
  { id: "fb-6", classId: "cls-103", satisfaction: 9, recommend: 9, comment: "เนื้อหา NLP ละเอียดและเข้าใจง่ายมาก", studentName: "สมชาย", anonymous: false, createdAt: "2026-03-05T14:00:00" },
  { id: "fb-7", classId: "cls-105", satisfaction: 7, recommend: 7, comment: "หัวข้อน่าสนใจแต่อยากให้มี case study มากขึ้น", studentName: null, anonymous: true, createdAt: "2026-03-08T15:30:00" },
];

export const mockTeachers = [
  { id: "t-1", name: "ดร. สมหญิง จันทร์เพ็ญ", email: "somying@zenityx.com", classCount: 12, avgScore: 9.0, department: "AI & Machine Learning" },
  { id: "t-2", name: "อ. ธนกร วงศ์สกุล", email: "thanakorn@zenityx.com", classCount: 8, avgScore: 7.7, department: "Deep Learning" },
  { id: "t-3", name: "ดร. อัญญา ปาเทล", email: "anya@zenityx.com", classCount: 10, avgScore: 8.4, department: "Computer Vision" },
  { id: "t-4", name: "อ. ประวิทย์ ศรีสุข", email: "prawit@zenityx.com", classCount: 6, avgScore: 8.1, department: "Data Science" },
];

export const chartData = [
  { name: "สัปดาห์ 1", satisfaction: 8.2, recommend: 8.5 },
  { name: "สัปดาห์ 2", satisfaction: 8.5, recommend: 8.8 },
  { name: "สัปดาห์ 3", satisfaction: 7.9, recommend: 8.1 },
  { name: "สัปดาห์ 4", satisfaction: 8.8, recommend: 9.0 },
  { name: "สัปดาห์ 5", satisfaction: 9.1, recommend: 9.3 },
  { name: "สัปดาห์ 6", satisfaction: 8.6, recommend: 8.9 },
];
