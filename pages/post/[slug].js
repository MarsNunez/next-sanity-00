import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import imageUrlBuilder from '@sanity/image-url';
import BlockConent from '@sanity/block-content-to-react';
import { Toolbar } from '../../components/toolbar';

const Post = ({title, body, image}) => {

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const imageBuilder = imageUrlBuilder({
      projectId: 'bh0w70h1',
      dataset: 'production'
    })

    setImageUrl(imageBuilder.image(image))
  }, [image])

  return (
    <div>
      <Toolbar />
      <div className={styles.main}>  
        <h1>{title}</h1>
        {imageUrl && <img className={styles.mainImage} src={imageUrl}/>}
        <div className={styles.body}>
          <BlockConent blocks={body} />
        </div>
      </div>
    </div>
  )
};

export const getServerSideProps = async pageContext => {
  const pageSlug = pageContext.query.slug;
  
  if (!pageSlug) {
    return {
      notFound: true,
    }
  }

  const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
  const url = `https://bh0w70h1.api.sanity.io/v2021-06-07/data/query/production?query=${query}`

  const result = await fetch(url).then(res => res.json());
  const post = result.result[0];

  if (!post) {
    return {
      notFound: true
    }
  } else {
    return {
      props: {
        title: post.title,
        body: post.body,
        image: post.mainImage
      }
    }
  }
}

export default Post;

