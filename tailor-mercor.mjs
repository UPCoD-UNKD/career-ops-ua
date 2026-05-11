import fs from 'fs';
import path from 'path';

const templatePath = 'templates/cv-template.html';
const outputPath = 'output/Akash_Kaintura_Mercor_Tailored.html';

const rawTemplate = fs.readFileSync(templatePath, 'utf8');

const data = {
  LANG: 'en',
  NAME: 'Akash Kaintura',
  EMAIL: 'akash.k96.official@gmail.com',
  PHONE: '+91 8979594537',
  LOCATION: 'Pune, India',
  LINKEDIN_URL: 'https://linkedin.com/in/akashkaintura',
  LINKEDIN_DISPLAY: 'linkedin.com/in/akashkaintura',
  PORTFOLIO_URL: 'https://github.com/UGilfoyle',
  PORTFOLIO_DISPLAY: 'github.com/UGilfoyle',
  PAGE_WIDTH: '800px',
  
  SECTION_SUMMARY: 'Professional Summary',
  SUMMARY_TEXT: 'Senior Software Engineer with 6+ years of experience in high-precision platform engineering. Expert in technical communication across multi-lingual and distributed teams. Specialized in building secure, idempotent services on AWS with a meticulous eye for detail, system prompt formatting, and architectural rigour. Proven track record in auditing AI-generated code and leading technical direction for enterprise-scale TypeScript/Python services.',

  SECTION_COMPETENCIES: 'Core Competencies',
  COMPETENCIES: `
    <span class="competency-tag">Multi-Language Programming</span>
    <span class="competency-tag">Technical Communication</span>
    <span class="competency-tag">High-Precision Engineering</span>
    <span class="competency-tag">System Prompt Design</span>
    <span class="competency-tag">Distributed Systems</span>
    <span class="competency-tag">AI Code Auditing</span>
    <span class="competency-tag">Idempotent Service Design</span>
  `,

  SECTION_EXPERIENCE: 'Professional Experience',
  EXPERIENCE: `
    <div class="job">
      <div class="job-header">
        <span class="job-company">Quest Global Engineering Services</span>
        <span class="job-period">July 2025 – Present</span>
      </div>
      <div class="job-role">Senior Software Engineer (Technical Lead — Platform reliability)</div>
      <ul>
        <li><strong>Led 4–6 engineers</strong> in technical direction and sprint delivery for high-precision, distributed TypeScript/Python services.</li>
        <li>Architected <strong>RFCs and service boundaries</strong> for complex enterprise client migrations, ensuring strict adherence to formatting and style requirements.</li>
        <li>Developed <strong>CI/CD guardrails</strong> and automated GitHub Actions rollbacks, maintaining 100% precision on critical production paths.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">INTVERSE IT Services</span>
        <span class="job-period">February 2025 – June 2025</span>
      </div>
      <div class="job-role">Full-Stack Platform Engineer</div>
      <ul>
        <li>Owned a greenfield order management platform, delivering it to paying customers in 8 weeks with <strong>zero critical defects</strong> through meticulous testing.</li>
        <li>Implemented <strong>audit-oriented logging</strong> and RBAC for sensitive financial operations, ensuring absolute traceability and compliance.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">Glidewell Software Services</span>
        <span class="job-period">August 2023 – October 2024</span>
      </div>
      <div class="job-role">Software Engineer 2</div>
      <ul>
        <li><strong>Audited AI-generated code</strong> for concurrency, logic, and security issues with high precision, improving code safety across core repositories.</li>
        <li>Optimized PostgreSQL P95 response times by 35% through meticulous SQL tuning and N+1 query elimination.</li>
        <li>Hardened inter-service authentication using OAuth2/JWT, ensuring clean and documented API standards.</li>
      </ul>
    </div>
  `,

  SECTION_PROJECTS: 'Selected Projects',
  PROJECTS: `
    <div class="project">
      <span class="project-title">Precision ETL & Validation Engine</span>
      <span class="project-badge">Python / PostgreSQL</span>
      <div class="project-desc">Built a complex migration engine for 25K+ users, performing deep validation and corruption checks on 15+ legacy databases with 100% data integrity.</div>
    </div>
  `,

  SECTION_EDUCATION: 'Education',
  EDUCATION: `
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Master of Computer Applications (MCA)</span>
        <span class="edu-year">2016 – 2018</span>
      </div>
      <div class="edu-org">Uttaranchal University</div>
    </div>
  `,

  SECTION_CERTIFICATIONS: 'Personal Focus',
  CERTIFICATIONS: `
    <div class="cert-item">
      <span class="cert-title">Commitment to Precision and Multi-lingual Documentation</span>
    </div>
  `,

  SECTION_SKILLS: 'Technical Skills',
  SKILLS: `
    <div class="skills-grid">
      <div class="skill-item"><span class="skill-category">Languages:</span> TypeScript, JavaScript, Python, Go, SQL, Bash</div>
      <div class="skill-item"><span class="skill-category">Frameworks:</span> Node.js, NestJS, Express, React, gRPC</div>
      <div class="skill-item"><span class="skill-category">Cloud:</span> AWS (ECS, Lambda, S3, IAM, VPC), Docker, Kubernetes, Terraform</div>
    </div>
  `
};

let html = rawTemplate;
for (const [key, val] of Object.entries(data)) {
  const placeholder = new RegExp(`{{${key}}}`, 'g');
  html = html.replace(placeholder, val);
}

fs.writeFileSync(outputPath, html);
console.log(`✓ Tailored HTML generated: ${outputPath}`);
