import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { postExerciseThunk } from "../../store/exercises";
import { bodyPartOptions, categoryOptions } from "../../utils/exerciseOptions";

export default function ExerciseModal() {
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data;
    let newImage;
    if (imageInput) {
      data = new FormData();
      data.append("name", name);
      data.append("body_part", bodyPart);
      data.append("category", category);
      data.append("desciprion", description);
      data.append("image_url", imageInput);
      data.append("owner_id", sessionUser.id);
      newImage = true;
    } else {
      data = {
        name: name,
        body_part: bodyPart,
        category: category,
        owner_id: sessionUser.id,
      };
      newImage = false;
    }
    let createdExercise;
    try {
      setImageLoading(true);
      createdExercise = await dispatch(postExerciseThunk(data, newImage));
      console.log("NEW EXERCISE", createdExercise);
      history.push(`/exercises/${createdExercise.id}`);
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
      <h2>Create Exercise</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="exercise-name">
          <h3>Exercise Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Exercise Name"
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
        <div className="image_url">
          <input
            type="file"
            accept="image/*"
            name="image_url"
            onChange={(e) => setImageInput(e.target.files[0])}
          />
          {imageLoading && <p className="exercise-image-load">LOADING...</p>}
          {errors.image ? (
            <label className="error-text" htmlFor="name">
              {errors.image}
            </label>
          ) : (
            <label className="exercise-image-load" htmlFor="name">
              EXERCISE IMAGE
            </label>
          )}
        </div>
        <button className="cancel-create-exercise" onClick={closeModal}>
          Cancel
        </button>
        <button className="create-exercise-button" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
