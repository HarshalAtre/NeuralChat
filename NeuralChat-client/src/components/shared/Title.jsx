import React from 'react'
import {Helmet} from "react-helmet-async"

const Title = ({ description=""}) => {
  return (
    <Helmet>
        <title> NeuralChat </title>
        <meta name="description" content={description}/>
    </Helmet>
  )
}

export default Title