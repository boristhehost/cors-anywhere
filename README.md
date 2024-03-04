# cors-anywhere

It is a cors proxy which accepts get,post,put and delete. Also it supports recieving file for get api and sending files through put and post api too using multipart/form-data or direct file.

###### Running it in localhost example

api route of cors-proxy is `post` here

```js
// dummy url
const url="http://localhost:8085/post/"

const encodedURL=encodeURIComponent(url)

// proxy url 
const proxyURL='http://localhost:8080/cors-submit/'

const fetchurl=`${proxyURL}?url=${encodedURL}`
```

**For simple get request**

```js
fetch(fetchurl,{
    method: 'GET',
    mode: "cors",
})
.then(res=>res.json())
.then(console.log)
.catch(console.error)
```

**For post requets**

Let our object is 

```js
const obj={
    username: 'hey',
    pass: '123',

}
```

for content-type 'application/json'

```js
fetch(fetchurl,{
    method : 'POST',
    mode: 'cors',
    headers: {
        'Content-Type' : 'application/json',
    },
    body : JSON.stringify(obj)
})
```

for content-type 'x-www-form-urlencoded'

```js
fetch(fetchurl,{
    method : 'POST',
    mode: 'cors',
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
    },
    body : new URLSearchParams(obj)
})
```

For sending files

```js
const fileInput=fileEle.files[0]

const obj={
    username: 'hey',
    pass: '123',
    fileInput
}

const convertToFormData=(obj)=>{
    const formData=new FormData()
    for(let prop in obj){

        if (obj[prop] instanceof File) {
              formData.append(prop, obj[prop], obj[prop].name);
        }
        else {
              formData.append(prop, obj[prop]);
        }
    }

    return formData;
}

// multipart/form-data way
fetch(fetchurl,{
    method : 'POST',
    mode: 'cors',

    body : new convertToFormData(obj)
})


// body as whole file way
fetch(fetchurl,{
    method : 'POST',
    mode: 'cors',

    body : fileInput,
})
```

Same for put requests too. For delete same for get

For recieving file

use `/cors-submit/getfile` api route

```js
fetch(fetchurl,{
    method: 'GET',
    mode: "cors",
    headers : {
        "accept-type" : "application/octlet-stream"
    }
})
.then(res=>res.blob())
.then(data=>{
    console.log('data: ',data)
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.download = "extraordinary12.mp3";
    link.href = url;
    link.click();
})
.catch(err=>{
    console.log('err: ',err)
})&nbsp;
```

&nbsp;



##### Sending file in chunks

For sending file

use `/cors-submit/chunks` api route

it can be configured whether to send body as file or form to target url but to send to proxy url, form body would be sent and following fields are to be sent

`pos`: position of filePiece

`isEnd`: boolean value indicating if current piece is last or not

`file`: this is actual file 

`filename`: original name of fle

`bodyToBeSent`

`fileFieldName`: target url may not expect file field name as 'file' so it can be specified here

```js
// submitIndividualGeneral(file,HOST/cors-submit/chunks?url=<encoded_url> ,resType,bodyType,method,bodyToBeSent,fileFieldName,chunksize)
// after fetch when link is ready message is filelink is expected and status and message field are optional
// bodyType is either 'form' or 'file'
// method is either 'post' or 'put'
// bodyToBeSent is the extra body other than file to be sent to target url
const submitIndividualGeneral = async (
  file,
  url,
  resType = "json",
  bodyType = "form",
  method = "post",
  bodyToBeSent = {},
  fileFieldName = "",
  chunksize = sliceSize
) => {
  const fileSize = file.size;
  const fileName = file.name;

  try {
    console.log("file: ", file);
    let start = 0;
    let end = chunksize;

    const filePieces = [];
    let i = 0;
    while (end <= fileSize) {
      const chunk = file.slice(start, end);
      if (end == fileSize) {
        filePieces.push({ pos: i, chunk, isEnd: true, fileName });
      } else {
        filePieces.push({ pos: i, chunk, isEnd: false });
      }

      start = end;
      end += chunksize;
      i++;
    }

    if (start < fileSize) {
      const chunk = file.slice(start, fileSize);
      filePieces.push({ pos: i, chunk, isEnd: true, fileName });
      i++;
    }

    // let fileLinks = [];
    for (let filePiece of filePieces) {
      const form = new FormData();

      // form.append('data',{pos: filePiece.pos,isEnd: filePiece.isEnd} )

      let res;

      form.append("pos", filePiece.pos);
      form.append("isEnd", filePiece.isEnd);
      form.append("file", filePiece.chunk);

      form.append("fileName", filePiece.fileName);

      form.append("bodyToBeSent", JSON.stringify(bodyToBeSent));

      // body to be sent to proxy will be form but from proxy to target will be file if bodytype is file
      form.append("bodyType", bodyType);

      if (bodyType === "form") {
        form.append("fileFieldName", fileFieldName);
      } else {
        form.append("fileFieldName", "fname");
      }

      // form.append("total", total);
      // form.append("fileIndex", index);

      res = await fetch(url, {
        method,
        // headers: {
        // 	'Content-Type': 'multipart/form-data'
        // },
        body: form,
      });

      let data;
      if (resType === "json") {
        data = await res.json();
      } else if (resType === "text") {
        data = await res.text();
      }

      console.log("res: ", data);
      if (filePiece.isEnd === true) {
        // const fileLink = data;
        return { status: "ok", data };
      }

      await promiseSetTimeOut(2000);
    }

    console.log("file: ", file);
    console.log("filePieces: ", filePieces);

    return { status: "error" };
  } catch (err) {
    console.log("err: ", err);
    // return { status: "error", message: err };
    throw err;
  }
};


 const encodedURL = encodeURIComponent(apiUrl);
  // const proxyURL='http://localhost:8080/cors-submit'
  // const proxyURL = `${CORS_PROXY}/cors-submit`;
  const proxyURL = `${CORS_PROXY}/cors-submit/chunks`;

const fetchurl = `${proxyURL}?url=${encodedURL}`;

const resData = await submitIndividualGeneral(
    file,
    fetchurl,
    "text",
    "file",
    "put"
);
```



### Summary

It needs target url in the form of url query so encode it and api route is `/cors-submit` and for receiving  files using GET method api route is `/cors-submit/getfile`