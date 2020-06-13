import React, { useState, useCallback, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as R from "ramda";
import classNames from "classnames";

import Popper from "@material-ui/core/Popper";
import LikeIcon from "@material-ui/icons/Favorite";
import LikeBorderIcon from "@material-ui/icons/FavoriteBorder";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { recipeActions } from "store/recipe/actions";
import { getProfileId } from "store/auth/selectors";

import "./styles.css";

const MAX_VIEWS = 10;

export const InfoLikes = (props) => {
  const { items, recipeId } = props;
  const likeIconRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const userId = useSelector(getProfileId);

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickLike = useCallback(() => {
    dispatch(recipeActions.changeLike(userId, recipeId));
  }, [userId, recipeId, dispatch]);

  const countLikes = useMemo(() => R.length(items), [items]);
  const isYouLiked = useMemo(
    () =>
      userId &&
      R.compose(R.includes(userId), R.map(R.path(["user", "id"])))(items),
    [userId, items]
  );

  const rendererLikes = useMemo(() => {
    return R.isEmpty(items) ? (
      <Typography variant="body2">Not found Likes</Typography>
    ) : (
      R.compose(
        R.concat(
          R.__,
          R.gt(countLikes, MAX_VIEWS)
            ? [<div>И еще {countLikes - MAX_VIEWS}</div>]
            : []
        ),
        R.map((like) => {
          return (
            <Typography key={like.id} variant="body2">
              {like.user.name}
            </Typography>
          );
        }),
        R.slice(0, MAX_VIEWS)
      )(items)
    );
  }, [items, countLikes]);

  const rendererContent = useMemo(() => {
    const Icon = isYouLiked ? LikeIcon : LikeBorderIcon;
    return (
      <div ref={likeIconRef} className="likes-list-info-icon" onClick={handleClickLike}>
        <Icon fontSize="large" />
        <Typography
          variant="subtitle2"
          className={classNames(
            "likes-list-info-icon-text",
            isYouLiked ? "liked" : "unliked"
          )}
        >
          {countLikes}
        </Typography>
      </div>
    );
  }, [countLikes, isYouLiked, handleClickLike]);

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="likes-list-info-wrapper"
      >
        {rendererContent}
      </div>
      <Popper open={isOpen} anchorEl={likeIconRef.current}>
        <Paper elevation={3} className="likes-list-paper">
          {rendererLikes}
        </Paper>
      </Popper>
    </>
  );
};
