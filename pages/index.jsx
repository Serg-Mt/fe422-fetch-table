import Head from "next/head";
import { Fetcher } from '../components/Fetcher';
import { ObjTable } from '../components/ObjTable';
import { useState } from 'react';

export default function Home() {
  // [user,setUser] = useState(null);
  return <>
    <Head>
      <title>Create Next App</title>
    </Head>
    <Fetcher url="https://jsonplaceholder.typicode.com/users" >
     
    </Fetcher>
{/* 
    <Fetcher url={''} callback={data=>setUser(data)}/>
    {user && <User user={user/>}  */}
  </>
}
