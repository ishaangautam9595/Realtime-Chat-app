import React, { useCallback, useEffect, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { RiSendPlane2Line } from "react-icons/ri";
import { ImAttachment } from "react-icons/im";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import documents from "../../assets/document.jpg";
import imagess from "../../assets/video.jpg";

export default function ChatInput({handleSendMsg, currentChat}) {

  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [ext, setExt] = useState();
  const [picture, setPicture] = useState(null);

  const docext = ["doc", "docx", "pdf", "zip", "xls", "json"];
  const docvid = ["mkv", "mp4", "webp"];
  const docimg = ["img", "png", "gif", "jpeg", "jpg"];

  useEffect(() => {
    setImgData(null);
    setPicture(null);
    setMsg("")
  },[currentChat])

  const handleDocumentClick = useCallback((event) => {
    let isEmojiClassFound = false;
    event &&
      event.path &&
      event.path.forEach((elem) => {
        if (elem && elem.classList) {
          const data = elem.classList.value;
          if (data.includes("emoji")) {
            event.preventDefault();
            isEmojiClassFound = true;
          }
        }
      });
    if (isEmojiClassFound === false && event.target.id !== "emoji")
      setShowEmojiPicker(false);
  }, []);

  useEffect(() => {
    document?.addEventListener("click", handleDocumentClick, false);
  }, [handleDocumentClick]);

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const sendChat = (event) => {
    if (event.which === 13 && event.shiftKey) {
      
    } else if (event.which === 13 || event.type === 'click') {
      event.preventDefault();
      handleSendMsg(picture ? picture.name : msg, picture, picture ? picture.type : 'text/plain');
      setMsg("");
      setImgData(null);
      setPicture(null);
    }
  };

  const onChangePicture = e => {
    console.log(e.target.files[0])
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      const name = e.target.files[0].name.split('.');
      setMsg(name);
      setExt(name[name.length - 1])
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
    
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <Container>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <textarea
          type="text"
          name="message"
          placeholder="Write a message"
          onKeyDown={(event) => sendChat(event)}
          
          onChange={(event) => setMsg(event.target.value)}
          value={msg}
        />
        {picture ? (
        <>
        <a href={imgData} target="_blank" rel="noreferrer">
        {docext.includes(ext) && <img src={documents} className="uploadimg" alt="images" />}
        {docvid.includes(ext) && <img src={imagess} className="uploadimg" alt="images" />}
        {docimg.includes(ext) && <img src={imgData} className="uploadimg" alt="images" />}
        </a>
        </>
        ) : (
          <></>
        )}
        <div className="pin">
          <label htmlFor="file">
            <ImAttachment />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={onChangePicture}
            multiple
          />
        </div>
        <div className="emoji">
          <BsEmojiSmile onClick={() => setShowEmojiPicker(true)} />
          {showEmojiPicker && <Picker lazyLoad onEmojiClick={handleEmojiClick} />}
        </div>

        <button type="submit" onClick={sendChat}>
          <RiSendPlane2Line />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 100%;
  background-color: #fff;
  padding: 10px 25px;
  @media screen and (min-width: 768px) and (max-width: 1080px) {
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: black;
    gap: 1rem;
    .emoji {
      position: inherit;
      svg {
        font-size: 1.5rem;
        color: grey;
        cursor: pointer;
        margin-bottom: -8px;
        @media (max-width: 768px) {
          margin-left: -10px;
        }
        .emoji-picker-react {
          position: absolute;
          top: -350px;
          background-color: rgba(39, 28, 70, 255);
          box-shadow: 0 5px 10px #9a86f3;
          border-color: #9a86f3;
          .emoji-scroll-wrapper::-webkit-scrollbar {
            background-color: rgba(39, 28, 70, 255);
            width: 5px;
            &-thumb {
              background-color: #085ab1;
            }
          }
          .emoji-categories {
            button {
              filter: contrast(0);
            }
          }
          .emoji-search {
            background-color: transparent;
            border-color: #9a86f3;
          }
          .emoji-group:before {
            background-color: rgba(39, 28, 70, 255);
          }
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 12px;
    gap: 1rem;
    background-color: #fff;
    textarea {
      width: 100%;
      background-color: transparent;
      color: black;
      border-radius: 10px;
      border: none;
      white-space: nowrap;
      overflow: hidden;
      padding: 0px 0px 0px 10px;
      font-size: 1rem;
      margin-top: 0px;
      &::selection {
        background-color: rgba(229, 229, 255, 255);
      }
      &:focus {
        outline: none;
      }
    }
    .link svg {
      color: #9f9f9f;
      font-size: 22px;
      cursor: pointer;
      vertical-align: middle;
    }
    .emoji svg {
      color: #9f9f9f;
      font-size: 22px;
      cursor: pointer;
      vertical-align: middle;
    }
    button {
      padding: 0.2rem 0rem;
      border-radius: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background-color: transparent !important;
      border: none;
      margin-bottom: -1px;
      @media screen and (min-width: 768px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        cursor: pointer;
        svg {
          font-size: 1rem;
          cursor: pointer;
        }
      }
      svg {
        font-size: 1.8rem;
        color: #812eba;
      }
    }
  }
`;
