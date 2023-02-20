import Head from 'next/head'
import Image from 'next/image'
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

	/** Calls the Orbis SDK and handle the results */
	async function connect() {
    let res = await orbis.connect();

    console.log("Connected: ", res);
		/** Check if connection is successful or not */
		if(res.status == 200) {
			setUser(res.did);
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

  async function createPost() {
    let res = await orbis.createPost({body: "gm!"});

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



  return (
    <>
      <div>
        {user ?
          <>
            <p>Connected with: {user}</p>
            <br/>
            <ul>
              <li><button onClick={() => getPosts()}>getPosts</button></li>
              <li><button onClick={() => createPost()}>createPost body: &quot;gm!&quot; </button></li>
              <li><button onClick={() => requestAccounts()}>web3 account: {account}</button></li>
              <li><button onClick={() => getBalance()}>web3 balance</button></li>
            </ul>

            <br/>
            <button onClick={() => logout()}>logout</button>
          </>
          :
          <button onClick={() => connect()}>Connect</button>
        }
  		</div>
      <br/>
      <a target="_target" href="https://orbis.club/documentation/api-documentation">API Documentation</a>
    </>
  )
}
