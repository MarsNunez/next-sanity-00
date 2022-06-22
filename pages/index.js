import { Toolbar } from '../components/toolbar'
import styles from '../styles/Home.module.css'
import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home({ posts }) {

  const [ mappedPosts, setMappedPosts ] = useState([]);
  const router = useRouter();

  useEffect(() => {
      const imgBuilder = imageUrlBuilder({
        projectId: 'bh0w70h1',
        dataset: 'production'
      });

      setMappedPosts(
        posts.map(p => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
          }
        })
      )
  }, [posts]);

  return (
    <>
      <Toolbar />
      <div className={styles.main}>
        <h1>Welcome To My Blog</h1>
        <h3>Recent Posts</h3>
        <div className={styles.feed}>
          {mappedPosts.map((p, index) => (
            <div onClick={() => router.push(`/post/${p.slug.current}`)} key={index} className={styles.post}>
              <h3>{p.title}</h3>
              <img className={styles.mainImage} src={p.mainImage} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async pageContext => {
  const query = encodeURIComponent('*[ _type == "post" ]');
  const url = `https://bh0w70h1.api.sanity.io/v2021-06-07/data/query/production?query=${query}`;
  const result = await fetch(url).then(res => res.json());

  if ( result.result.lenght == 0 ) {
    return {
      props: {
        posts: [],
      }
    }
  } else {
    return {
      props: {
        posts: result.result
      }
    }
  }
}
