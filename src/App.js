import { useState, useEffect, useRef } from "react"

const App = () => {
  const [ value, setValue] = useState(" ")
  const [ message, setMessage] = useState(null) 
  const [ previousChats, setPreviousChats] = useState([])
  const [ currentTitle, setCurrentTitle] = useState(null)
  const loader = document.querySelector("#loading")

  //update input on change
  const onInput = (e) => setValue(e.target.value);

  //clear input on after submit
  const onClear = () => {
      setTimeout(()=> {
        setValue(" ")
     }
     ,1000);
  }

  // showing loading
  function displayLoading() {
    loader.classList.add("display")
  }

  // hiding loading 
  function hideLoading() {
    loader.classList.remove("display")
  }

  // always scroll to the bottom/latest message
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
  }


  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
     displayLoading()
     const response = await fetch("http://localhost:8000/completions", options)
     const data = await response.json()
     setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
    hideLoading()
  }

  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
     getMessages(e);
    }
  }


  // run this with whatever we get back from the api
  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats, 
            {
              title: currentTitle,
              role: "user",
              content: value
            },{
              title: currentTitle,
              role: message.role,
              content:  message.content
            }
        ]
      ))
    };
    onClear()
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)


  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li  key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by <span className="custom">HollyLlama</span></p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1 className="custom">HollyLlamaGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => 
            <li key={index}>
              <p className="role">{chatMessage.role} :</p>
              <p>{chatMessage.content}</p>
            </li>)}
            <AlwaysScrollToBottom />
        </ul>
        <div className="bottom-section">
        <div id="loading"></div>
          <div className="input-container" onKeyDown={handleKeyDown}>
            <div className="input-wrap"> 
              <input id="inputId" value={value} onChange={onInput}/>
            </div>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">Chat GPT Mar 14 version. Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your freeback will help us improve.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
