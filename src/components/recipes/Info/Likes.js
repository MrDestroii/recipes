import React, { useState, useCallback, useRef, useMemo } from "react";

import * as R from "ramda";

import Popper from "@material-ui/core/Popper";
import LikeIcons from "@material-ui/icons/Favorite";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export const InfoLikes = (props) => {
  const { items } = props;
  const likeIconRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const rendererLikes = useMemo(() => {
    return R.isEmpty(items) ? (
      <Typography variant="body2">Not found Likes</Typography>
    ) : (
      R.map((like) => {
        return (
          <Typography key={like.id} variant="body2">
            {like.user.name}
          </Typography>
        );
      })(items)
    );
  }, [items]);

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <LikeIcons innerRef={likeIconRef} />
      </div>
      <Popper open={isOpen} anchorEl={likeIconRef.current}>
        <Paper elevation={3} className="likes-list-paper">
          {rendererLikes}
        </Paper>
      </Popper>
    </>
  );
};
