import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import {AiOutlineIdcard,AiOutlineUser,AiOutlineGlobal,AiOutlineWarning,AiOutlineCheck,AiOutlineClose,AiOutlineSearch} from 'react-icons/ai'

export default function Home() {
  const [API,setAPI] = useState("https://rickandmortyapi.com/api/character")
  const [chars,setChars]=useState([])
  const [search,setSearch]=useState('')
  const [error,setError]=useState()

  const alive = (status)=>{
    switch (status) {
      case 'unknown':
        return <AiOutlineWarning className={styles.articleSVG}/>
      case 'Alive':
        return <AiOutlineCheck className={styles.articleSVG}/>
      case 'Dead':
        return <AiOutlineClose className={styles.articleSVG}/>
    }
  }

  const ipt=useRef(null)

  const handleSubmit = (e)=>{
    e.preventDefault()
    setError(false)
    renderChars(`https://rickandmortyapi.com/api/character/?name=${search}`)
    setSearch('')
  }

  function renderChars(api) {
    fetch(api)
    .then(res=>res.json())
    .then(dat=>{
      const info = dat.info;
      !!info&&setAPI(info.next)
      const results = dat.results;
      !!results?setChars(results):(setError(`Couldn't find "${search}"`),setChars([]),setAPI(null))
    })
  }

  function loadMore() {
    fetch(API)
    .then(res=>res.json())
    .then(dat=>{
      const info = dat.info;
      setAPI(info.next)
      const results = dat.results;
      setChars(chars.concat(results))
    })
  }

  useEffect(()=>{
    renderChars(API)
  },[])

  return (
    <>
      <Head>
        <title>Rick and Morty API</title>
        <meta property="og:title" content="Tarjetas de rick y morty"/>
        <meta property="og:image" content="https://i.imgur.com/pjKFIdg.png"/>
        <meta property="og:url" content="https://www.iamdelrio.com"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property='og:type' content='website'/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.searcher}>
          <input maxLength={44} autoFocus id='top' type="text" value={search} placeholder='Mr. Poopybutthole' className={styles.searcherInput} onChange={(e)=>{setSearch(e.target.value)}}/>
          {!!error&&<span className={styles.errorContainer}><p>{error}</p><button className={styles.loadMore} onClick={handleSubmit}>Back</button></span>}
        </form>
        <section className={styles.section}>
          {chars.map(({image,location,name,origin,species,status,type,id})=>
            <article key={id} className={styles.article}>
              <img src={image} loading="lazy" title={name} className={styles.articleImg}/>
              <span className={styles.articleRow}><AiOutlineIdcard className={styles.articleSVG}/><h1>{name}</h1></span>
              <span className={styles.articleRow}><AiOutlineUser className={styles.articleSVG}/><p className={styles.articleP}>{species}</p></span>
              <span className={styles.articleRow}><AiOutlineGlobal className={styles.articleSVG}/><p className={styles.articleP}>{origin.name}</p></span>
              <span className={styles.articleRow}>{alive(status)}<small className={styles.articleP}>{status}</small></span>
            </article>
          )}
        </section>
        <a href='#top' className={styles.searchSticky}><AiOutlineSearch/></a>
        {!!API&&<button onClick={loadMore} className={styles.loadMore}>More</button>}
      </main>
    </>
  )
}
