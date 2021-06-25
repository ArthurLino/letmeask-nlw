import { ReactNode } from "react";

import classNames from "classnames";

import "./styles.scss";

type QuestionProps = {
  content: string,
  author: {
    name: string,
    avatar: string,
  }
  children?: ReactNode,
  isAnswered?: boolean,
  isHighlighted?: boolean,
}

export function Question({ 
  content, 
  author, 
  children, 
  isAnswered = false,
  isHighlighted = false,
}: QuestionProps) {
  return (
    <div 
      className={classNames(
        'question',
        {answeredQuestion: isAnswered},
        {highlightedQuestion: isHighlighted && !isAnswered},
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {
            children
          }          
        </div>
      </footer>
    </div>
  )
}