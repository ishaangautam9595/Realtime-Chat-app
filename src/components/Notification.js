import React from "react";
import { instance } from "../utils/Instance";
import { Button } from "./Modal";

const style4 = {
  marginRight: "10px",
};

const Notification = ({notifications, handleNotification, count, setCount, setNotifications}) => {
  const handleOneNotification = (id) => {
    instance.post(`/notifications/read`, {type: "one", actionId : id}).then((response) => {
      setNotifications(response.data.data.response);
    })
    setCount(count ? count - 1 : 0);
   };
  return (
    <>
      {notifications.length ? (
        <>
          <div className="item">
            <div className="right">
            <Button onClick={handleNotification} style={style4}>
              Mark all read
            </Button>
            </div>
            {notifications?.map((notification) => {
              return (
                <div key={notification._id}>
                  {notification.read === true ? (
                    <p>{notification.message}</p>
                  ) : (
                    <div className="unread" value={notification._id} onClick={() =>
                      handleOneNotification(notification._id) || notification.read === true }>{notification.message}</div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h5>ALL DONE FOR NOW<br />No new notification to show</h5>
        </>
      )}
    </>
  );
};

export default Notification;
