import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";

import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

import React, { useState, useEffect } from 'react';
import { Orbis } from "@orbisclub/orbis-sdk";

let orbis = new Orbis();

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  /** The user object */
	const [user, setUser] = useState();
	const [account, setAccount] = useState();
  const router = useRouter();
  const [list, setList] = useState();

  useEffect(() => {
    if (router.isReady) {
      setList(JSON.parse(decodeURI(router.query.data)));
      console.log(list);
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

    console.log("getPosts: ", res);
  }

  async function createPost() {
    let res = await orbis.createPost({body: "gm!"});

    console.log("createPost: ", res);
  }

  async function createPostToQuantum() {
    let res = await orbis.createPost({body: "gm! quantum!",context:"kjzl6cwe1jw145g4auw7m562b0ml3d3a3ip3blc8e76lm9fuvoai9783d9eeu2h"});

    console.log("createPost: ", res);
  }

  async function createPostToRandDTest() {
    let res = await orbis.createPost({body: "gm! R & D test!",context:"kjzl6cwe1jw145fzq7rg45wb75rjfswrojm5f9vhluup2ooggvjmgs37tvv2k0k"});

    console.log("createPost: ", res);
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

  async function createPostWishList() {
    const text = document.getElementById('listtext');
    const value = text.value;
    const json = JSON.parse(value);
    console.log(json);
  }

  return (
    <>
      <div>
        {user ?
          <>
            <p>Connected with: {user}</p>
            <br/>
            <ul>
              <li><button onClick={() => getPosts()}>getPosts</button></li>
              <li><button onClick={() => getPostsQuantum()}>getPosts at quantum</button></li>
              <li><button onClick={() => createPost()}>createPost body: &quot;gm!&quot; </button></li>
              <li><button onClick={() => createPostToQuantum()}>createPost to quantum</button></li>
              <li><button onClick={() => createPostToRandDTest()}>createPost to R & D test</button></li>
              <li><button onClick={() => requestAccounts()}>web3 account: {account}</button></li>
              <li><button onClick={() => getBalance()}>web3 balance</button></li>
              <li><button onClick={() => connectLit()}>Connect Lit</button></li>
              <li><button onClick={() => getMembers()}>get members quantum</button></li>
              <li><button onClick={() => getMembersCh()}>get members R & D test</button></li>
              <li>
                <textarea id="listtext" cols="80" rows="20">
                </textarea>
                <button onClick={() => createPostWishList()}>createPostWishList</button></li>
            </ul>
            <br/>
            <button onClick={() => logout()}>logout</button>
          </>
          :
          <>
            <button onClick={() => connect()}>Connect</button>
          </>
        }
  		</div>
      {list ?
        <>
          <p>{list['title']}</p>
          <ul>
            {
              list['things'].map((i) => (
                <li><img src={i.src} alt={i.alt} />{i.alt}</li>
              ))
            }
          </ul>
          {user?
            <button onClick={() => uploadData()}>Upload</button>
            :
            <></>
          }
        </>
      :
        <></>
      }
      <br/>
      <a target="_target" href="https://orbis.club/documentation/api-documentation">API Documentation</a>
    </>
  )
}
