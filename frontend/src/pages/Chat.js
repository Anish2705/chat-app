import { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const scrollRef = useRef();
  const fileInputRef = useRef();

  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/conversations/${user._id}`
    );
    setConversations(res.data);
    socket.emit("joinConversations", res.data.map(c => c._id));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then(res => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (!currentChat) return;

    axios
      .get(`http://localhost:5000/api/messages/${currentChat._id}`)
      .then(res => setMessages(res.data));
  }, [currentChat]);

  useEffect(() => {
    socket.on("receiveMessage", msg => {
      if (msg.conversationId === currentChat?._id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND
  const handleSend = async () => {
    if (!currentChat) return;

    if (message.trim()) {
      socket.emit("sendMessage", {
        conversationId: currentChat._id,
        sender: user._id,
        text: message,
      });
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", currentChat._id);
      formData.append("sender", user._id);

      const res = await axios.post(
        "http://localhost:5000/api/messages/upload",
        formData
      );

      setMessages(prev => [...prev, res.data]);
    }

    setMessage("");
    setFile(null);
    fileInputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const startChat = async (receiverId) => {
    await axios.post(
      "http://localhost:5000/api/conversations/find-or-create",
      {
        senderId: user._id,
        receiverId,
      }
    );

    setShowPanel(false);
    loadConversations();
  };

  const createGroup = async () => {
    if (!groupName) return alert("Enter group name");
    if (selectedUsers.length === 0) return alert("Select users");

    await axios.post(
      "http://localhost:5000/api/conversations/group",
      {
        name: groupName,
        members: [...selectedUsers, user._id],
      }
    );

    setGroupName("");
    setSelectedUsers([]);
    setShowPanel(false);
    loadConversations();
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5" }}>
      
      {/* LEFT SIDEBAR (IMPROVED) */}
      <div style={{
        width: "30%",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #ddd"
      }}>

        {/* HEADER */}
        <div style={{
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee"
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#25d366",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold"
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <b>{user.username}</b>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setShowPanel(!showPanel)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "#1890ff",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              +
            </button>

            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "none",
                background: "#ff4d4f",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* PANEL */}
        {showPanel && (
          <div style={{ padding: "10px", background: "#fafafa" }}>
            <b>Start Chat</b>
            {users.map((u) => (
              <div key={u._id} onClick={() => startChat(u._id)} style={{ padding: "5px", cursor: "pointer" }}>
                {u.username}
              </div>
            ))}

            <hr />

            <b>Create Group</b>

            <input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{ width: "100%", margin: "5px 0" }}
            />

            {users.map((u) => (
              <div key={u._id}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedUsers(prev => [...prev, u._id]);
                    else
                      setSelectedUsers(prev =>
                        prev.filter(id => id !== u._id)
                      );
                  }}
                />
                {u.username}
              </div>
            ))}

            <button
              onClick={createGroup}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "#25d366",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Create Group
            </button>
          </div>
        )}

        {/* CHAT LIST */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((c) => {
            const otherUser = c.members.find(m => m._id !== user._id);
            const name = c.isGroup ? c.name : otherUser?.username;

            return (
              <div key={c._id} onClick={() => setCurrentChat(c)} style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {name}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE (RESTORED CHAT UI) */}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
        {currentChat ? (
          <>
            <div style={{ padding: "15px", borderBottom: "1px solid #ddd", background: "#fff" }}>
              <b>
                {currentChat.isGroup
                  ? currentChat.name
                  : currentChat.members.find(m => m._id !== user._id)?.username}
              </b>
            </div>

            <div style={{
              flex: 1,
              overflowY: "scroll",
              padding: "15px",
              background: "#e5ddd5"
            }}>
              {messages.map((msg, i) => {
                const senderId =
                  typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                const isMine = senderId === user._id;

                return (
                  <div key={i} ref={scrollRef} style={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start"
                  }}>
                    <div style={{
                      background: isMine ? "#dcf8c6" : "#fff",
                      padding: "10px",
                      borderRadius: "15px",
                      margin: "6px",
                      maxWidth: "60%"
                    }}>
                      {msg.text && <div>{msg.text}</div>}

                      {msg.file && (
                        msg.file.match(/\.(jpg|png|jpeg)$/) ? (
                          <img
                            src={`http://localhost:5000/uploads/${msg.file}`}
                            width="150"
                          />
                        ) : (
                          <a href={`http://localhost:5000/uploads/${msg.file}`}>
                            Download
                          </a>
                        )
                      )}

                      <div style={{ fontSize: "10px", textAlign: "right" }}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: "flex",
              padding: "10px",
              gap: "8px",
              background: "#fff",
              borderTop: "1px solid #ddd"
            }}>
              <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />

              <input
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: "1px solid #ccc"
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ padding: "20px" }}>
            <h3>Select a chat</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;