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
})
```

&nbsp;

### Summary

It needs target url in the form of url query so encode it and api route is `/cors-submit` and for receiving  files using GET method api route is `/cors-submit/getfile`