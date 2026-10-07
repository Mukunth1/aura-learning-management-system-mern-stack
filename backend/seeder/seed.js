import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Certificate from '../models/Certificate.js';
import Review from '../models/Review.js';
import Discussion from '../models/Discussion.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_mern');
    console.log('[Seeder] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Section.deleteMany({});
    await Lesson.deleteMany({});
    await Enrollment.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    await Certificate.deleteMany({});
    await Review.deleteMany({});
    await Discussion.deleteMany({});

    console.log('[Seeder] Cleared previous database collections');

    // Create Users (pre('save') in User.js automatically hashes password)
    const defaultPassword = 'password123';

    const admin = await User.create({
      name: 'Alex Vance',
      email: 'admin@lms.com',
      password: defaultPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      headline: 'Platform Super Administrator & Lead Architect',
      bio: 'Overseeing global curricula standards, instructor vetting, and platform infrastructure.',
    });

    const instructor1 = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'instructor@lms.com',
      password: defaultPassword,
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      headline: 'AI Research Director & Former DeepMind Contributor',
      bio: 'PhD in Computer Science from Stanford. Published 20+ papers in generative models and neural networks.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    });

    const instructor2 = await User.create({
      name: 'Marcus Sterling',
      email: 'marcus@lms.com',
      password: defaultPassword,
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      headline: 'Staff Full-Stack Architect, ex-Netflix & Stripe',
      bio: 'Specializing in high-throughput distributed systems, React internals, and Node.js microservices.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    });

    const student1 = await User.create({
      name: 'Elena Rostova',
      email: 'student@lms.com',
      password: defaultPassword,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
      headline: 'Aspiring Full-Stack Software Engineer',
      bio: 'Enthusiastic about building scalable cloud apps and mastering TypeScript, React, and Node.js.',
    });

    const student2 = await User.create({
      name: 'David Miller',
      email: 'david@lms.com',
      password: defaultPassword,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      headline: 'DevOps & Cloud Enthusiast',
      bio: 'Learning container orchestration and automated CI/CD pipelines.',
    });

    console.log('[Seeder] Seeded users (Admin, Instructors, Students)');

    // Sample video URLs (reliable open mp4 streams)
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    ];

    // Helper to create course with sections and lessons
    const createFullCourse = async ({
      title,
      subtitle,
      description,
      category,
      level,
      price,
      discountPrice,
      isFree,
      thumbnail,
      instructor,
      isFeatured,
      rating,
      studentsCount,
      sectionsData,
      quizData,
    }) => {
      const course = new Course({
        title,
        subtitle,
        description,
        category,
        level,
        price,
        discountPrice,
        isFree,
        thumbnail,
        trailerVideoUrl: sampleVideos[0],
        instructor: instructor._id,
        isFeatured,
        rating,
        studentsCount,
        status: 'published',
        requirements: [
          'Basic understanding of programming fundamentals',
          'Computer with Node.js and code editor installed',
          'Motivation to build production-ready projects',
        ],
        whatYouWillLearn: [
          'Architect resilient production systems from scratch',
          'Implement enterprise state management and secure authentication',
          'Deploy and monitor cloud applications with zero downtime',
          'Write automated tests and maintain clean, modular codebase',
        ],
        tags: [category.toLowerCase(), 'fullstack', 'enterprise', 'modern'],
      });

      await course.save();

      const createdSectionIds = [];

      for (let sIdx = 0; sIdx < sectionsData.length; sIdx++) {
        const sData = sectionsData[sIdx];
        const section = new Section({
          title: sData.title,
          course: course._id,
          order: sIdx + 1,
          lessons: [],
        });
        await section.save();

        const createdLessonIds = [];
        for (let lIdx = 0; lIdx < sData.lessons.length; lIdx++) {
          const lData = sData.lessons[lIdx];
          const lesson = new Lesson({
            title: lData.title,
            section: section._id,
            course: course._id,
            description: lData.description || `Comprehensive lesson explaining ${lData.title} with practical examples.`,
            videoUrl: lData.videoUrl || sampleVideos[lIdx % sampleVideos.length],
            duration: lData.duration || '12:30',
            durationSeconds: lData.durationSeconds || 750,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            resources: [
              {
                title: `${lData.title} - Source Code & Cheat Sheet`,
                url: 'https://github.com',
                type: 'pdf',
                size: '2.4 MB',
              },
            ],
            order: lIdx + 1,
            isFreePreview: lIdx === 0 && sIdx === 0, // First lesson free preview
          });
          await lesson.save();
          createdLessonIds.push(lesson._id);
        }

        section.lessons = createdLessonIds;
        await section.save();
        createdSectionIds.push(section._id);
      }

      course.sections = createdSectionIds;
      await course.save();

      // Create Quiz
      if (quizData) {
        await Quiz.create({
          course: course._id,
          title: quizData.title,
          description: quizData.description,
          passingScore: quizData.passingScore || 75,
          timeLimitMinutes: quizData.timeLimitMinutes || 15,
          questions: quizData.questions,
        });
      }

      return course;
    };

    // Course 1: Full-Stack MERN
    const course1 = await createFullCourse({
      title: 'Full-Stack React & Node.js Architecture: The Definitive Masterclass',
      subtitle: 'Build high-concurrency microservices, real-time WebSockets, and modern React 18 UI architectures.',
      description: 'Master the end-to-end development of enterprise web applications. From designing database schemas with MongoDB to configuring JWT refresh tokens, WebSocket event streaming, and state-of-the-art React components, this course transforms you into a high-impact Staff Full-Stack Engineer.',
      category: 'Web Development',
      level: 'Intermediate',
      price: 89.99,
      discountPrice: 49.99,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      instructor: instructor2,
      isFeatured: true,
      rating: 4.9,
      studentsCount: 1420,
      sectionsData: [
        {
          title: 'Section 1: Foundations of Resilient MERN Architecture',
          lessons: [
            { title: 'Modern Monorepo & Project Scaffolding', duration: '14:20', durationSeconds: 860 },
            { title: 'MongoDB Data Modeling & Indexing Strategies', duration: '18:45', durationSeconds: 1125 },
            { title: 'Express Middleware, Security Headers & Rate Limits', duration: '15:10', durationSeconds: 910 },
          ],
        },
        {
          title: 'Section 2: Authentication & Real-Time Event Pipelines',
          lessons: [
            { title: 'Secure JWT Auth, Role RBAC & Password Hashing', duration: '22:15', durationSeconds: 1335 },
            { title: 'Socket.io Bidirectional Rooms & Connection Management', duration: '19:40', durationSeconds: 1180 },
            { title: 'File Upload Pipelines with Multer & Cloudinary', duration: '16:05', durationSeconds: 965 },
          ],
        },
        {
          title: 'Section 3: State-of-the-Art Frontend Engineering',
          lessons: [
            { title: 'React 18 Performance: Concurrent Mode & Transitions', duration: '20:30', durationSeconds: 1230 },
            { title: 'Designing Fluid SaaS UI with Tailwind CSS & Motion', duration: '17:50', durationSeconds: 1070 },
            { title: 'Production Deployment: Docker, CI/CD & SSL', duration: '24:10', durationSeconds: 1450 },
          ],
        },
      ],
      quizData: {
        title: 'MERN Full-Stack Certification Assessment',
        description: 'Demonstrate your mastery over full-stack system design, security, and React state management.',
        passingScore: 75,
        timeLimitMinutes: 20,
        questions: [
          {
            question: 'What is the primary benefit of compounding MongoDB indexes for queries with multiple filters?',
            options: [
              'It reduces memory usage to zero regardless of collection size',
              'It allows the query planner to satisfy both filtering and sorting without an in-memory sort stage',
              'It automatically normalizes data into relational SQL tables',
              'It encrypts database documents on the disk',
            ],
            correctAnswerIndex: 1,
            explanation: 'Compound indexes allow MongoDB to scan matching keys in sorted order, avoiding costly COLLSCANs and blocking memory sort operations.',
          },
          {
            question: 'Why should sensitive JWT tokens not be stored in standard browser localStorage for critical applications?',
            options: [
              'localStorage data expires after 10 minutes automatically',
              'localStorage is vulnerable to Cross-Site Scripting (XSS) extraction',
              'localStorage does not support string serialization',
              'localStorage requires an active internet connection to read',
            ],
            correctAnswerIndex: 1,
            explanation: 'Any JavaScript running on the page can access localStorage; therefore, HttpOnly cookies provide higher resilience against XSS token exfiltration.',
          },
          {
            question: 'In Socket.io, how do you broadcast an event to all users in a specific room except the sender?',
            options: [
              'io.emit("event", data)',
              'socket.broadcast.to(room).emit("event", data)',
              'socket.inAll(room).send(data)',
              'io.room(room).dispatch(data)',
            ],
            correctAnswerIndex: 1,
            explanation: '`socket.broadcast.to(room).emit()` dispatches the message to all peers in the specified room without echoing it back to the originating socket.',
          },
          {
            question: 'What React hook is optimal for caching the result of expensive mathematical calculations across renders?',
            options: [
              'useCallback',
              'useMemo',
              'useRef',
              'useEffect',
            ],
            correctAnswerIndex: 1,
            explanation: '`useMemo` caches the calculated value between renders and only recomputes when one of its specified dependencies changes.',
          },
        ],
      },
    });

    // Course 2: Deep Learning & Generative AI
    const course2 = await createFullCourse({
      title: 'Deep Learning & Generative AI with PyTorch & Hugging Face',
      subtitle: 'Build LLM agents, fine-tune transformer models, and deploy diffusion pipelines with production GPUs.',
      description: 'Step into the frontier of Artificial Intelligence. Learn how transformers work under the hood, fine-tune open-weights models like Llama 3, build retrieval-augmented generation (RAG) vector pipelines, and deploy scalable inference APIs.',
      category: 'AI & Machine Learning',
      level: 'Advanced',
      price: 119.99,
      discountPrice: 79.99,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      instructor: instructor1,
      isFeatured: true,
      rating: 4.95,
      studentsCount: 2150,
      sectionsData: [
        {
          title: 'Section 1: Tensor Math & Neural Network Fundamentals',
          lessons: [
            { title: 'Tensors, Autograd & Gradient Descent in PyTorch', duration: '16:40', durationSeconds: 1000 },
            { title: 'Convolutional & Recurrent Architectures', duration: '21:10', durationSeconds: 1270 },
          ],
        },
        {
          title: 'Section 2: Transformer Architectures & Self-Attention',
          lessons: [
            { title: 'Multi-Head Attention from Mathematical Scratch', duration: '25:30', durationSeconds: 1530 },
            { title: 'Hugging Face Pipelines & Pretrained Weights', duration: '18:15', durationSeconds: 1095 },
            { title: 'Fine-Tuning LLMs with LoRA & QLoRA', duration: '28:00', durationSeconds: 1680 },
          ],
        },
      ],
      quizData: {
        title: 'Generative AI & Transformer Foundations Exam',
        description: 'Test your understanding of attention mechanisms, quantization, and fine-tuning strategies.',
        passingScore: 80,
        timeLimitMinutes: 20,
        questions: [
          {
            question: 'What is the primary role of the Query, Key, and Value vectors in scaled dot-product attention?',
            options: [
              'To encrypt embeddings prior to activation',
              'To dynamically weight how much focus each token should assign to every other token in the sequence',
              'To downscale the image pixel dimensions',
              'To prune inactive neurons during backward pass',
            ],
            correctAnswerIndex: 1,
            explanation: 'The dot product of queries and keys computes pairwise attention weights, which are normalized via softmax and multiplied against values.',
          },
          {
            question: 'Why does LoRA (Low-Rank Adaptation) significantly reduce GPU VRAM requirements during model fine-tuning?',
            options: [
              'It freezes the base weights and decomposes the weight update matrix into two low-rank matrices',
              'It deletes 90% of model layers',
              'It runs strictly on CPU using system RAM',
              'It replaces floating point math with integer addition only',
            ],
            correctAnswerIndex: 0,
            explanation: 'LoRA leaves pretrained weights frozen and trains small adapter matrices $A$ and $B$ where rank $r \\ll d$, drastically minimizing trainable parameters and optimizer states.',
          },
        ],
      },
    });

    // Course 3: AWS Cloud Architecture
    const course3 = await createFullCourse({
      title: 'AWS Cloud Architecture & Kubernetes Microservices',
      subtitle: 'Design high-availability cloud infrastructure with Terraform, Docker containers, EKS, and CI/CD pipelines.',
      description: 'Prepare for real-world DevOps and Cloud Engineering. Master VPC topologies, IAM security least-privilege, automated Terraform infrastructure-as-code, and resilient Kubernetes clusters on AWS.',
      category: 'Cloud & DevOps',
      level: 'Intermediate',
      price: 99.99,
      discountPrice: 59.99,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      instructor: instructor2,
      isFeatured: true,
      rating: 4.88,
      studentsCount: 1680,
      sectionsData: [
        {
          title: 'Section 1: AWS VPC Networking & Compute',
          lessons: [
            { title: 'Designing High-Availability Multi-AZ VPCs', duration: '19:10', durationSeconds: 1150 },
            { title: 'EC2, Auto Scaling Groups & Application Load Balancers', duration: '22:45', durationSeconds: 1365 },
          ],
        },
        {
          title: 'Section 2: Kubernetes Orchestration & GitOps',
          lessons: [
            { title: 'Containerization with Multi-Stage Dockerfiles', duration: '15:20', durationSeconds: 920 },
            { title: 'Deploying Production Clusters on Amazon EKS', duration: '26:15', durationSeconds: 1575 },
          ],
        },
      ],
      quizData: {
        title: 'Cloud Infrastructure & K8s Competency Test',
        description: 'Verify your knowledge of cloud networking, container orchestration, and fault tolerance.',
        passingScore: 70,
        timeLimitMinutes: 15,
        questions: [
          {
            question: 'What is the purpose of an AWS Private Subnet in a standard 3-tier architecture?',
            options: [
              'To allow public direct internet ingress without a firewall',
              'To isolate backend databases and application servers from direct internet exposure',
              'To store DNS records for public domain routing',
              'To host static frontend assets for public browsers',
            ],
            correctAnswerIndex: 1,
            explanation: 'Private subnets route outbound traffic via NAT Gateways and have no public IP addresses assigned, safeguarding internal servers.',
          },
        ],
      },
    });

    // Course 4: UI/UX Design Systems
    const course4 = await createFullCourse({
      title: 'Next-Gen UI/UX Design Systems: Figma to Interactive Prototypes',
      subtitle: 'Create design tokens, auto-layout components, WCAG accessible systems, and high-fidelity SaaS prototypes.',
      description: 'Unleash your visual storytelling. Learn how industry leaders build scalable design systems in Figma, leverage auto-layout, manage color contrast ratios for WCAG AA compliance, and translate designs into production CSS tokens.',
      category: 'UI/UX Design',
      level: 'All Levels',
      price: 69.99,
      discountPrice: 39.99,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800',
      instructor: instructor1,
      isFeatured: true,
      rating: 4.92,
      studentsCount: 1890,
      sectionsData: [
        {
          title: 'Section 1: Foundations of Design Tokens & Typography',
          lessons: [
            { title: 'Spatial 8px Grid & Typographic Scales', duration: '13:50', durationSeconds: 830 },
            { title: 'Harmonious Color Palettes & Dark Mode Contrast', duration: '16:20', durationSeconds: 980 },
          ],
        },
        {
          title: 'Section 2: Component Libraries & Micro-Interactions',
          lessons: [
            { title: 'Figma Variants, Properties & Auto-Layout 5', duration: '20:05', durationSeconds: 1205 },
            { title: 'Prototyping Micro-Interactions & Spring Physics', duration: '18:30', durationSeconds: 1110 },
          ],
        },
      ],
      quizData: {
        title: 'Design Systems & Accessibility Assessment',
        description: 'Prove your ability to construct scalable, accessible visual systems.',
        passingScore: 70,
        timeLimitMinutes: 15,
        questions: [
          {
            question: 'Under WCAG 2.1 AA guidelines, what is the minimum required contrast ratio for regular body text?',
            options: ['2.5:1', '3.0:1', '4.5:1', '7.0:1'],
            correctAnswerIndex: 2,
            explanation: 'WCAG AA requires at least 4.5:1 for standard text (and 3:1 for large text 18pt+ or bold 14pt+).',
          },
        ],
      },
    });

    // Course 5: Cybersecurity Defense
    const course5 = await createFullCourse({
      title: 'Cybersecurity Defense: Ethical Hacking & Zero Trust Networks',
      subtitle: 'Identify vulnerabilities, perform penetration testing, configure SIEM logging, and implement Zero Trust.',
      description: 'Protect organizations against modern attack vectors. Explore network reconnaissance, OWASP Top 10 web vulnerabilities, cryptography, and defense-in-depth security architectures.',
      category: 'Cybersecurity',
      level: 'Advanced',
      price: 109.99,
      discountPrice: 69.99,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      instructor: instructor2,
      isFeatured: false,
      rating: 4.87,
      studentsCount: 940,
      sectionsData: [
        {
          title: 'Section 1: Network Scanning & Vulnerability Analysis',
          lessons: [
            { title: 'Reconnaissance with Nmap & Wireshark', duration: '17:35', durationSeconds: 1055 },
            { title: 'Exploiting Web Application Vulnerabilities (OWASP)', duration: '24:15', durationSeconds: 1455 },
          ],
        },
      ],
    });

    // Course 6: Free Course - Modern JavaScript & TypeScript Essentials
    const course6 = await createFullCourse({
      title: 'Modern JavaScript & TypeScript Essentials for Beginners',
      subtitle: 'Zero to hero crash course in ESNext, asynchronous promises, closures, and TypeScript type safety.',
      description: 'Kickstart your engineering journey with modern JavaScript. Understand event loops, async/await, modern modules, array methods, and static typing with TypeScript.',
      category: 'Web Development',
      level: 'Beginner',
      price: 0,
      discountPrice: 0,
      isFree: true,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800',
      instructor: instructor2,
      isFeatured: true,
      rating: 4.96,
      studentsCount: 4200,
      sectionsData: [
        {
          title: 'Section 1: JavaScript Engine & Asynchronous Execution',
          lessons: [
            { title: 'Call Stack, Event Loop & Microtasks', duration: '12:15', durationSeconds: 735 },
            { title: 'Promises, Async/Await & Error Handling', duration: '15:40', durationSeconds: 940 },
          ],
        },
      ],
    });

    console.log('[Seeder] Seeded 6 comprehensive courses with curriculum and quizzes');

    // Create Reviews
    await Review.create({
      course: course1._id,
      user: student1._id,
      rating: 5,
      comment: 'Hands down the best MERN stack course on the internet! The architectural clarity, real-time WebSocket setup, and production patterns helped me land my dream software role.',
      likes: 24,
    });

    await Review.create({
      course: course1._id,
      user: student2._id,
      rating: 5,
      comment: 'Super deep dive. Loved the explanation of MongoDB indexes and JWT security patterns. Phenomenal instructor pacing.',
      likes: 12,
    });

    await Review.create({
      course: course2._id,
      user: student1._id,
      rating: 5,
      comment: 'Dr. Jenkins breaks down complex tensor math and attention equations better than anyone in academia. Absolutely stellar!',
      likes: 31,
    });

    console.log('[Seeder] Seeded reviews');

    // Enroll Student 1 in Course 1 with 100% completion & issued certificate
    const allCourse1Lessons = [];
    const populatedCourse1 = await Course.findById(course1._id).populate({
      path: 'sections',
      populate: { path: 'lessons' },
    });
    populatedCourse1.sections.forEach((sec) => {
      sec.lessons.forEach((les) => allCourse1Lessons.push(les._id));
    });

    // Create Certificate for student1
    const certCode = 'LMS-2026-X9K2W7QP';
    const cert = await Certificate.create({
      certificateId: certCode,
      student: student1._id,
      course: course1._id,
      instructor: instructor2._id,
      issueDate: new Date('2026-09-18T10:30:00Z'),
      grade: 'Distinction (98%) - Top Tier Honors',
    });

    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      progress: 100,
      completedLessons: allCourse1Lessons,
      lastAccessedLesson: allCourse1Lessons[allCourse1Lessons.length - 1],
      status: 'completed',
      certificateIssued: true,
      certificate: cert._id,
      completedAt: new Date('2026-09-18T10:30:00Z'),
    });

    // Enroll Student 1 in Course 2 with 50% in progress
    const course2Lessons = [];
    const populatedCourse2 = await Course.findById(course2._id).populate({
      path: 'sections',
      populate: { path: 'lessons' },
    });
    populatedCourse2.sections.forEach((sec) => {
      sec.lessons.forEach((les) => course2Lessons.push(les._id));
    });

    const halfLessons = course2Lessons.slice(0, 2);
    await Enrollment.create({
      student: student1._id,
      course: course2._id,
      progress: 50,
      completedLessons: halfLessons,
      lastAccessedLesson: course2Lessons[1] || course2Lessons[0],
      status: 'active',
      certificateIssued: false,
    });

    // Also enroll student 2
    await Enrollment.create({
      student: student2._id,
      course: course1._id,
      progress: 35,
      completedLessons: allCourse1Lessons.slice(0, 3),
      lastAccessedLesson: allCourse1Lessons[2],
      status: 'active',
      certificateIssued: false,
    });

    console.log('[Seeder] Seeded enrollments and official verified certificates');

    // Create Discussions in first lesson of course 1
    const firstLessonId = allCourse1Lessons[0];
    await Discussion.create({
      lesson: firstLessonId,
      course: course1._id,
      user: student1._id,
      message: 'When running `npm install` in a clean monorepo, is it recommended to use npm workspaces or pnpm for strict dependency isolation?',
      replies: [
        {
          user: instructor2._id,
          message: 'Great question Elena! pnpm is fantastic for hardlinking and preventing phantom dependencies, whereas npm workspaces is universally supported with zero extra tools. In this module we use npm workspaces for maximum compatibility.',
          createdAt: new Date(),
        },
      ],
      upvotes: 8,
      isPinned: true,
    });

    console.log('[Seeder] Seeded real-time lesson discussions');
    console.log('[Seeder] Database seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedData();
