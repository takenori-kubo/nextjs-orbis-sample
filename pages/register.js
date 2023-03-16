import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";

import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

import React, { useState, useEffect } from 'react';
import { Orbis } from "@orbisclub/orbis-sdk";

let orbis = new Orbis();

const inter = Inter({ subsets: ['latin'] })

function ListDisplay({list, onoff_start}) {
  console.log(list);
  console.log(onoff_start);
  const [onoff, setOnOff] = useState(onoff_start? onoff_start: 0);

  function doToggle() {
    onoff == 0? setOnOff(1) : setOnOff(0);
  }

  return (
    <>
      <p>{list['title']}</p>
      <ul>
      {
        onoff == 1?
          list['things'].map((i,index) => (
            <li key={index}><img src={i.src} alt={i.alt} />{i.alt}</li>
          ))
        :
        <></>
      }
      </ul>
      <button onClick={() => doToggle()}>{onoff == 0? '開く' : '閉じる'}</button>
    </>
  );
}

function PostList({posts}) {
  if (posts.length === 0) {
    return (
      <p className="alert alert-info">ありません</p>
    );
  }

  return (
    <ul className="list-unstyled">
      {posts.map(i => (
        <>
          <ListDisplay list={i.data}/>
        </>
      ))}
    </ul>
  );
}


export default function Home() {

  /** The user object */
	const [user, setUser] = useState();
	const [account, setAccount] = useState();
  const router = useRouter();
  const [list, setList] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.data) {
        setList(JSON.parse(decodeURI(router.query.data)));
        console.log(list);
      }
    }
  },
  [router.query, router]
  );

	/** Calls the Orbis SDK and handle the results */
	async function connect() {
    let res = await orbis.connect();

    console.log("Connected: ", res);
		/** Check if connection is successful or not */
		if(res.status == 200) {
			setUser(res.did);
      setAccount(res.details.metadata.address);
		} else {
			console.log("Error connecting to Ceramic: ", res);
			alert("Error connecting to Ceramic.");
		}
	}

  async function uploadData() {
    if (user && list) {
      console.log(list);
      let res = await orbis.createPost({
        title: list['title'],
        body: list['title'],
        data: list,
        tags: ['amzn list'], 
        context:"kjzl6cwe1jw145g4auw7m562b0ml3d3a3ip3blc8e76lm9fuvoai9783d9eeu2h"
      });
      console.log("C&U Uploaded: ", res);
      if (res.status == 200) {
        setTimeout(() => { window.close();}, 3000);
      }
    }
	}

  async function connectLit() {
    let res = await orbis.connectLit(window.ethereum);

    console.log("Connected: ", res);
		/** Check if connection is successful or not */
		if(res.status == 200) {

    } else {
			console.log("Error connecting to Ceramic: ", res);
			alert("Error connecting to Ceramic.");
		}
	}

  async function logout() {
    let res = await orbis.logout();

    console.log("Logged out: ", res);

    if(res.status == 200) {
			setUser(undefined);
		}
  }

  async function getPosts() {
    let res = await orbis.getPosts();

    console.log("getPosts: ", res);
  }

  async function getPostsQuantum() {
    let res = await orbis.getPosts({ context: "kjzl6cwe1jw145g4auw7m562b0ml3d3a3ip3blc8e76lm9fuvoai9783d9eeu2h" });

    console.log("getPosts: ", res.data);

    let tmp_posts = [];
    res.data.map((i) => {
      if (i.content.tags && i.content.tags[0] == "amzn list") {
        tmp_posts.push(i.content);
      }
    })

    setPosts(tmp_posts);
    console.log(posts);
  }

  async function requestAccounts() {
    let res = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (res.length > 0) {
      setAccount(res[0]);
    }
    console.log("eth_requestAccounts: ", res);
  }

  async function getBalance() {
    let res = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [
        account,
        "latest",
      ],
    });
    console.log("eth_getBalance: ", res);
  }

  async function getMembers() {
    let res = await orbis.getGroupMembers('kjzl6cwe1jw145g4auw7m562b0ml3d3a3ip3blc8e76lm9fuvoai9783d9eeu2h');
    console.log("getMembers: ", res);
  }

  async function getMembersCh() {
    let res = await orbis.getGroupMembers('kjzl6cwe1jw145fzq7rg45wb75rjfswrojm5f9vhluup2ooggvjmgs37tvv2k0k');
    console.log("getMembersCh: ", res);
  }

  return (
    <>
      <div>
        {user ?
          <>
            <p>Connected with: {user}</p>
            <br/>
          </>
          :
          <>
            <button onClick={() => connect()}>Connect</button>
          </>
        }
  		</div>
      {list ?
        <>
          <ListDisplay list={list} onoff_start={1} />
          {user?
            <button onClick={() => {uploadData()}}>Upload</button>
            :
            <></>
          }
        </>
      :
        <></>
      }
    </>
  )
}
