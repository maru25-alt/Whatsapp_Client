export const LocalStorageVariables  = {
    TOKEN : "token",
    USERNAME: "username",
    PHOTOURL: "photoUrl",
    TELEPHONE: "telephone",
    USERID: "userID",
    STATUS: "status",
}


export const TOKEN = localStorage.getItem(LocalStorageVariables.TOKEN);
export const USERNAME = localStorage.getItem(LocalStorageVariables.USERNAME);
export const PHOTOURL = localStorage.getItem(LocalStorageVariables.PHOTOURL);
export const TELEPHONE = localStorage.getItem(LocalStorageVariables.TELEPHONE);
export const USERID = localStorage.getItem(LocalStorageVariables.USERID);
export const STATUS = localStorage.getItem(LocalStorageVariables.STATUS);