import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {
  editExerciseThunk,
  getExcerciseThunk,
  getExercisesThunk,
} from "../../store/exercises";
import { bodyPartOptions, categoryOptions } from "../../utils/exerciseOptions";
import OpenModalButton from "../OpenModalButton";
import DeleteExerciseModal from "../DeleteExerciseModal";

export default function EditExerciseModal({ exerciseId }) {
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const singleExercise = useSelector((state) => state.exercise.singleExercise);
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getExcerciseThunk(exerciseId));
  }, [dispatch, exerciseId]);

  useEffect(() => {
    if (singleExercise) {
      setName(singleExercise.name || "");
      setBodyPart(singleExercise.body_part || "");
      setCategory(singleExercise.category || "");
      setDescription(singleExercise.description || "");
      setImageUrl(singleExercise.image_url || "");
    }
  }, [singleExercise]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data;
    let newImage;
    if (imageInput) {
      data = new FormData();
      data.append("name", name);
      data.append("body_part", bodyPart);
      data.append("category", category);
      data.append("description", description);
      data.append("image_url", imageInput);
      newImage = true;
    } else {
      data = {
        name: name,
        body_part: bodyPart,
        category: category,
        description: description,
      };
      newImage = false;
    }
    let createdExercise;
    try {
      setImageLoading(true);
      createdExercise = await dispatch(
        editExerciseThunk(exerciseId, data, newImage)
      );
      history.push(`/exercises/${createdExercise.id}`);
      dispatch(getExercisesThunk());
      dispatch(getExcerciseThunk(createdExercise.id));
      closeModal();
    } catch (errRes) {
      setImageLoading(false);
      if (Array.isArray(errRes.errors)) {
        let errorsObj = {};
        errRes.errors.forEach((err) => {
          const [key, val] = err.split(" : ");
          errorsObj[key] = val;
        });
        setErrors(errorsObj);
      } else {
        setErrors({ image: "There was an error uploading the image" });
      }
    }
  };

  return (
    <div>
      <h2>Edit Exercise</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="exercise-name">
          <h3>Exercise Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Workout Name"
          />
          <div className="error-container">
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
        </div>
        <div className="select-fields">
          <div>
            <p>Body Part</p>
            <select
              value={bodyPart}
              onChange={(e) => {
                setBodyPart(e.target.value);
              }}
            >
              <option value="">Select Body Part</option>
              {bodyPartOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.body_part && (
              <p className="error-text">{errors.body_part}</p>
            )}
          </div>
          <div>
            <p>Category</p>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>
        </div>
        <h3>Description</h3>
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Description"
        />
        <div className="error-container">
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}
        </div>
        {errors.image ? (
          <label className="error-text" htmlFor="name">
            {errors.image}
          </label>
        ) : (
          <label className="exercise-image-load" htmlFor="name">
            Exercise Image
          </label>
        )}
        <div className="image_url">
          <input
            type="file"
            accept="image/*"
            name="image_url"
            onChange={(e) => {
              setImageInput(e.target.files[0]);
              setImageUrl(null);
            }}
          />
          {imageUrl ? <p>Old Image: {imageUrl}</p> : <div />}
          {imageLoading && <p className="exercise-image-load">LOADING...</p>}
        </div>
        <button className="cancel-create-exercise" onClick={closeModal}>
          Cancel
        </button>
        <button className="create-exercise-button" type="submit">
          Edit
        </button>
        <OpenModalButton
          className="delete-exercise-button"
          buttonText="Delete"
          modalComponent={<DeleteExerciseModal exerciseId={exerciseId} />}
        />
      </form>
    </div>
  );
}
