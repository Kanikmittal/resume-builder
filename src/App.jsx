import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', linkedin: '', github: '',
    summary: '', skills: '', experience: '', education: '',
    certifications: '', projects: ''
  })
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateResume = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate a professional resume with proper formatting for:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
LinkedIn: ${formData.linkedin}
GitHub: ${formData.github}
Summary: ${formData.summary}
Skills: ${formData.skills}
Experience: ${formData.experience}
Education: ${formData.education}
Certifications: ${formData.certifications}
Projects: ${formData.projects}

Format with clear sections, bullet points, and professional language. Make it ATS friendly.` }] }]
          })
        }
      )
      const data = await response.json()
      setResume(data.candidates[0].content.parts[0].text)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const downloadPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(`
      <html><head><title>${formData.name} Resume</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
        pre { white-space: pre-wrap; font-family: Arial; }
      </style></head>
      <body><pre>${resume}</pre></body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const inputStyle = {
    padding: '10px', borderRadius: '8px',
    border: '1px solid #ccc', fontSize: '15px', width: '100%'
  }
  const labelStyle = { fontWeight: 'bold', color: '#374151', marginBottom: '4px', display: 'block' }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px', fontFamily: 'Arial', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '32px' }}>🤖 AI Resume Builder</h1>
        <p style={{ color: '#6b7280' }}>Fill in your details and let AI create your professional resume</p>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '8px' }}>Personal Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {[['name','Full Name'],['email','Email'],['phone','Phone'],['linkedin','LinkedIn URL'],['github','GitHub URL']].map(([field, label]) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input name={field} placeholder={label} value={formData[field]} onChange={handleChange} style={inputStyle} />
            </div>
          ))}
        </div>

        <h3 style={{ color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '8px' }}>Professional Details</h3>
        <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
          {[
            ['summary', 'Professional Summary', 'e.g. Full Stack Developer with 2 years experience...'],
            ['skills', 'Skills', 'e.g. React, Node.js, MongoDB, Python, Git...'],
            ['experience', 'Work Experience', 'e.g. Software Intern at XYZ - Built REST APIs using Node.js...'],
            ['education', 'Education', 'e.g. BCA from MIT, Meerut (2021-2024) - 75%'],
            ['certifications', 'Certifications', 'e.g. Full Stack Web Dev - Udemy (2024), Inside LVMH - Coursera (2024)'],
            ['projects', 'Projects', 'e.g. AI Chatbot using Gemini API - React, Node.js | GitHub: link']
          ].map(([field, label, placeholder]) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <textarea name={field} placeholder={placeholder} rows={3}
                value={formData[field]} onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          ))}
        </div>

        <button onClick={generateResume} disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? '⏳ Generating your resume...' : '✨ Generate Resume with AI'}
        </button>
      </div>

      {resume && (
        <div style={{ marginTop: '30px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#2563eb', margin: 0 }}>Your Generated Resume</h2>
            <button onClick={downloadPDF}
              style={{ padding: '10px 20px', background: '#16a34a', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
              📄 Download / Print
            </button>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#374151' }}>
            {resume}
          </div>
        </div>
      )}
    </div>
  )
}

export default App