import { useEffect, useState } from 'react'
import './App.css'

const services = [
  { day: 'Sunday', time: '9:00 AM', label: 'Celebration service' },
  { day: 'Sunday', time: '11:30 AM', label: 'Celebration service' },
  { day: 'Wednesday', time: '6:30 PM', label: 'Midweek gathering' },
]

const events = [
  { date: '2026-09-14', title: 'Welcome Home Sunday', time: '9:00 AM & 11:30 AM', tone: 'gold' },
  { date: '2026-09-21', title: 'Jubilee Night of Worship', time: '7:00 PM', tone: 'coral' },
  { date: '2026-09-28', title: 'Serve the City', time: '10:00 AM', tone: 'blue' },
]

const answers = {
  service: 'Our Sunday services are at 9:00 AM and 11:30 AM, with a midweek gathering on Wednesday at 6:30 PM. Every service is about 70 minutes and includes live worship, a practical message, and space to pray.',
  kids: 'Jubilee Kids is available during both Sunday services for children from nursery through grade 5. Our team creates a safe, joyful space where kids can meet Jesus and make friends.',
  location: 'We gather at 18 Jubilee Avenue, Riverside. There is free parking on site, and our welcome team can help you find your way when you arrive.',
  connect: 'We would love to meet you. Start with a Sunday service, or send us a message through the Connect form below. A member of our team will reply within two working days.',
}

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    play: <path d="m9 6 9 6-9 6V6Z" fill="currentColor" stroke="none" />,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [serviceList, setServiceList] = useState(services)
  const [eventList, setEventList] = useState(events)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([{ from: 'ai', text: 'Hi, I am Jubilee Guide. Ask me anything about our church, services, kids, or how to get connected.' }])
  const [contactStatus, setContactStatus] = useState('')
  const [contactSending, setContactSending] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [servicesResponse, eventsResponse] = await Promise.all([fetch('/api/services'), fetch('/api/events')])
        if (servicesResponse.ok) setServiceList(await servicesResponse.json())
        if (eventsResponse.ok) setEventList(await eventsResponse.json())
      } catch {
        // Local content keeps the static site usable when the API is not running.
      }
    }
    loadContent()
  }, [])

  async function askQuestion(value = question) {
    const prompt = value.trim()
    if (!prompt) return
    setChat((items) => [...items, { from: 'user', text: prompt }])
    setQuestion('')
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: prompt }) })
      if (!response.ok) throw new Error('Chat request failed')
      const data = await response.json()
      setChat((items) => [...items, { from: 'ai', text: data.answer }])
    } catch {
      const lower = prompt.toLowerCase()
      const answer = lower.includes('service') || lower.includes('time') ? answers.service : lower.includes('kid') || lower.includes('child') ? answers.kids : lower.includes('where') || lower.includes('location') || lower.includes('address') ? answers.location : lower.includes('connect') || lower.includes('visit') ? answers.connect : 'That is a great question. Our team would love to help with that personally. Send us a message through the Connect section and we will get back to you soon.'
      setChat((items) => [...items, { from: 'ai', text: answer }])
    }
  }

  return (
    <div className="site-shell">
      <header className="nav wrap">
        <a className="brand" href="#top" aria-label="Jubilee Assembly home"><span className="brand-mark">J</span><span>JUBILEE <b>ASSEMBLY</b></span></a>
        <nav><a href="#about">About</a><a href="#gather">Gather</a><a href="#events">Events</a><a href="#give">Give</a></nav>
        <a className="button button-dark nav-cta" href="#connect">Plan a visit <Icon name="arrow" size={16} /></a>
      </header>
      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy"><p className="eyebrow">A church for every season</p><h1>Find your people.<br /><em>Find your place.</em></h1><p className="hero-intro">Jubilee Assembly is a growing family learning to live the way of Jesus, together. You are welcome here, exactly as you are.</p><div className="hero-actions"><a className="button button-dark" href="#connect">Plan your visit <Icon name="arrow" size={16} /></a><a className="watch-link" href="#about"><span className="play"><Icon name="play" size={13} /></span> Watch our story</a></div></div>
          <div className="hero-art" aria-label="Abstract sunrise artwork"><div className="sun"></div><div className="hill hill-back"></div><div className="hill hill-front"></div><span className="art-label">COME AS YOU ARE</span><span className="art-note">01 / 04</span></div>
          <div className="scroll-note"><span className="line"></span> Scroll to explore</div>
        </section>
        <section className="service-strip"><div className="wrap service-inner"><div className="service-heading"><span className="live-dot"></span><span>Join us this week</span></div>{serviceList.map((service) => <div className="service" key={service.day + service.time}><strong>{service.day}</strong><span>{service.time}</span><small>{service.label}</small></div>)}<a className="text-link" href="#gather">View gatherings <Icon name="arrow" size={15} /></a></div></section>
        <section id="about" className="intro wrap"><div className="section-tag">01 / Our story</div><div><h2>There is a seat<br /><em>with your name on it.</em></h2><p>Church should feel like a place you can breathe. At Jubilee, we make room for honest questions, real relationships, and a faith that meets you in everyday life.</p><a className="text-link" href="#connect">Get to know us <Icon name="arrow" size={15} /></a></div><div className="quote"><span>“</span><p>We are becoming a people who make the love of Jesus impossible to miss.</p><small>— Pastor Daniel &amp; Mia</small></div></section>
        <section id="gather" className="gather-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Find your rhythm</p><h2>Make space for<br /><em>what matters.</em></h2></div><p>There is more than one way to belong. Find the place that feels like your next step.</p></div><div className="gather-grid"><article className="gather-card feature-card"><span className="card-number">01</span><div><h3>Sunday gatherings</h3><p>Worship, a clear word, and a community that knows your name.</p><a href="#top" className="round-arrow" aria-label="Explore Sunday gatherings"><Icon name="arrow" size={19} /></a></div></article><article className="gather-card kids-card"><span className="card-number">02</span><div><h3>Jubilee Kids</h3><p>Big faith for little hearts.</p><a href="#connect" className="round-arrow" aria-label="Learn about Jubilee Kids"><Icon name="arrow" size={19} /></a></div></article><article className="gather-card serve-card"><span className="card-number">03</span><div><h3>Serve the city</h3><p>Love looks like action.</p><a href="#events" className="round-arrow" aria-label="See serve events"><Icon name="arrow" size={19} /></a></div></article></div></div></section>
        <section id="events" className="events wrap"><div className="section-heading"><div><p className="eyebrow">Don't miss a thing</p><h2>Coming <em>up.</em></h2></div><a className="text-link" href="#events">See all events <Icon name="arrow" size={15} /></a></div><div className="event-list">{eventList.map((event, index) => <article className="event-row" key={event.title}><div className={`event-date ${events[index % events.length].tone}`}><strong>{new Date(event.date).getDate()}</strong><span>{new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span></div><div className="event-title"><h3>{event.title}</h3><p><Icon name="calendar" size={15} /> {event.date} · {event.time}</p></div><a className="round-arrow" href="#connect" aria-label={`Learn more about ${event.title}`}><Icon name="arrow" size={18} /></a></article>)}</div></section>
        <section className="ask-section"><div className="wrap ask-layout"><div><p className="eyebrow">Your questions, answered</p><h2>Ask <em>Jubilee.</em></h2><p className="ask-copy">Wondering what to expect, where to park, or how to get involved? Our guide is here to help.</p><div className="suggestions"><button onClick={() => askQuestion('What time are your Sunday services?')}>Service times</button><button onClick={() => askQuestion('What is available for kids?')}>Jubilee Kids</button><button onClick={() => askQuestion('Where do you meet?')}>Location</button></div></div><div className="chat-box"><div className="chat-head"><span className="avatar">J</span><div><strong>Jubilee Guide</strong><small>Usually replies instantly</small></div><span className="online"></span></div><div className="messages">{chat.slice(-4).map((message, index) => <div key={`${message.text}-${index}`} className={`message ${message.from}`}>{message.text}</div>)}</div><form className="chat-form" onSubmit={(event) => { event.preventDefault(); askQuestion() }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question..." aria-label="Ask Jubilee a question" /><button type="submit" aria-label="Send question"><Icon name="send" size={17} /></button></form></div></div></section>
        <section id="give" className="give wrap"><div className="give-copy"><p className="eyebrow">Generosity changes things</p><h2>Give with<br /><em>purpose.</em></h2><p>Your generosity helps Jubilee bring hope to our city and create spaces where people can belong.</p><a className="button button-dark" href="#connect">Give online <Icon name="arrow" size={16} /></a></div><div className="give-art"><span>Every act<br />of kindness<br /><strong>ripples.</strong></span><div className="ripple ripple-one"></div><div className="ripple ripple-two"></div><div className="ripple ripple-three"></div></div></section>
        <section id="connect" className="connect-section"><div className="wrap connect"><div><p className="eyebrow">We would love to hear from you</p><h2>Take the<br /><em>next step.</em></h2><p>Whether you are brand new to church or have been around for years, there is a place for you here.</p></div><form className="connect-form" onSubmit={async (event) => { event.preventDefault(); setContactSending(true); setContactStatus(''); const form = event.currentTarget; const formData = new FormData(form); try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData)) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Message could not be sent.'); setContactStatus(data.message); form.reset() } catch (error) { setContactStatus(error.message) } finally { setContactSending(false) } }}><label>Name<input name="name" placeholder="Your name" required maxLength="100" /></label><label>Email<input name="email" type="email" placeholder="you@example.com" required maxLength="254" /></label><label>How can we help?<select name="subject" defaultValue="" required><option value="" disabled>Choose one</option><option>Plan a visit</option><option>Join a group</option><option>Prayer request</option></select></label><textarea name="message" placeholder="Tell us a little more..." required maxLength="5000"></textarea><button className="button button-light" type="submit" disabled={contactSending}>{contactSending ? 'Sending...' : 'Send message'} <Icon name="send" size={16} /></button>{contactStatus && <small className="contact-status">{contactStatus}</small>}</form></div></section>
      </main>
      <footer className="footer wrap"><a className="brand" href="#top"><span className="brand-mark">J</span><span>JUBILEE <b>ASSEMBLY</b></span></a><p>18 Jubilee Avenue, Riverside · hello@jubileeassembly.org</p><div className="socials"><a href="#top">Instagram</a><a href="#top">YouTube</a><a href="#top">Facebook</a></div><small>© 2024 Jubilee Assembly</small></footer>
    </div>
  )
}

export default App
