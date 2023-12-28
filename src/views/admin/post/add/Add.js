import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'services/axios.inercept';
// react plugin for creating notifications over the dashboard
import { Formik, ErrorMessage } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
// import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import {
  convertToRaw,
  EditorState,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './add.css';
import Error from '../../../../utils/error/Error';
import draftToHtml from 'draftjs-to-html';
import { useHistory } from 'react-router';

const Add = () => {
  // get data from when post get clicked
  const history = useHistory();
  const redirectPost = history.location?.state;
  // console.log(redirectPost);

  const [topic, setTopic] = useState([]);
  const [userImg, setUserImg] = useState(
    redirectPost ? redirectPost.image : ''
  );

  // inital value for rich text
  const contentDataState = ContentState.createFromBlockArray(
    convertFromHTML(`${redirectPost?.content}`)
  );
  const editorDataState = EditorState.createWithContent(contentDataState);
  const [editorState, setEditorState] = useState(
    redirectPost ? editorDataState : ''
  );

  const handleFileSelected = (e) => {
    //if user override another img we need to delete the existing one first at the remote storage
    // console.log(userImg);
    if (userImg) {
      const imgId = userImg.split('.appspot.com/')[1];
      axios
        .delete(`/admin/media/remove/${imgId}`)
        .then((response) => {
          // console.log(response);
          // setUserImg('');
        })
        .catch((e) => {
          console.error(e);
          setUserImg('');
        });
    }

    //add file to remote storage
    const file = e.target.files[0];
    if (!(file?.type === 'image/png' || file?.type === 'image/jpeg')) {
      return toast.error('يجب توفير صورة jpeg/png');
    }
    if (file?.size > 1024 * 1024 * 0.5) {
      return toast.error(' يجب توفير صورة نصف ميجا علي الاكثر');
    }
    let data = new FormData();
    data.append('file', file, file?.name);

    axios
      .post('/admin/media/upload', data)
      .then((response) => {
        // console.log(response.data.link);
        setUserImg(response.data.link);
        toast.success(`تم رفع الصورة / ${file?.name}`);
      })
      .catch((e) => console.error(e));
  };

  function handleDeleteFile() {
    const imgId = userImg.split('.appspot.com/')[1];
    // console.log(imgId)
    axios
      .delete(`/admin/media/remove/${imgId}`)
      .then((response) => {
        setUserImg('');
        // console.log(response);
      })
      .catch((e) => {
        setUserImg('');
        console.error(e);
      });
  }

  const handleSubmitForm = (values, { setSubmitting }) => {
    // setSubmitting(false);
    // const mqal = convertToRaw(values.content.getCurrentContent());
    // // console.log(x.blocks[0].text);
    // values = { ...values, content: mqal.blocks[0].text };
    // console.log(values);
    //get htmlContent
    const draftStateContent = values.content;
    const htmlContent = draftToHtml(draftStateContent);
    // console.log(htmlContent);
    let finalValues;
    if (userImg) {
      finalValues = { ...values, content: htmlContent, image: userImg };
    } else {
      finalValues = { ...values, content: htmlContent };
    }
    // console.log(finalValues);
    // setEditorState(editorState);

    if (redirectPost) {
      axios
        .put('/admin/posts/' + redirectPost._id, finalValues)
        .then((response) => {
          toast.success(`تم التعديل بنجاح`);
          // console.log(response);
          setSubmitting(false);
          history.push('/admin/post');
        })
        .catch((e) => {
          setSubmitting(false);
          toast.error('خطا ...');
        });
    } else {
      axios
        .post('/admin/posts', finalValues)
        .then((response) => {
          toast.success(`تم الرفع بنجاح`);
          // console.log(response);
          setSubmitting(false);
          history.push('/admin/post');
        })
        .catch((e) => {
          setSubmitting(false);
          toast.error('خطا ...');
        });
    }
  };

  useEffect(() => {
    axios.get('admin/topics').then((data) => {
      // console.log(data.data.data);
      const topics = data.data.data.map((el, index) => (
        <option value={el._id} key={index}>
          {el.name}
        </option>
      ));
      setTopic(topics);
    });
  }, []);

  return (
    <>
      <Toaster />
      <div className="content">
        <Formik
          initialValues={{
            title: redirectPost ? redirectPost.title : '',
            content: redirectPost
              ? convertToRaw(editorState.getCurrentContent())
              : '',
            topicId: redirectPost ? redirectPost.topic._id : '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = 'مطلوب';
            }

            if (!values.topicId) {
              errors.topicId = 'مطلوب';
            }

            return errors;
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  placeholder="العنوان"
                  name="title"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                />

                <ErrorMessage name="title" component={Error} />
              </FormGroup>

              <FormGroup>
                <Input
                  id="topicId"
                  name="topicId"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // value={values.topicId}
                >
                  {redirectPost ? (
                    <option key={800} value={redirectPost.topic._id}>
                      {redirectPost.topic.name}
                    </option>
                  ) : (
                    <option key={700}>الفئة</option>
                  )}

                  {topic}
                  {/* {
                    <option value={1234} key={2}>
                      {'blabla'}
                    </option>
                  } */}
                </Input>

                <ErrorMessage name="topicId" component={Error} />
              </FormGroup>

              <div className="userImgContainer">
                <label for="img" className="adminAddImgBtn">
                  اختر الصورة
                </label>
                <input
                  className="userImgInput"
                  onChange={handleFileSelected}
                  id="img"
                  name="img"
                  accept="image/png, image/jpeg"
                  type="file"
                />

                {userImg && (
                  <div className="adminAddImgContainer">
                    <button
                      type="button"
                      className="adminAddImgDeleteBtn"
                      onClick={handleDeleteFile}
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <img className="userImg" src={userImg} alt="userImg" />
                  </div>
                )}
                {/* {redirectPost && (
                  <div className="adminAddImgContainer">
                    <button
                      type="button"
                      className="adminAddImgDeleteBtn"
                      onClick={handleDeleteFile}
                    >
                      <i class="fas fa-times"></i>
                    </button>
                    <img
                      className="userImg"
                      src={redirectPost.image}
                      alt="userImg"
                    />
                  </div>
                )} */}
              </div>

              <FormGroup>
                <div>
                  <Editor
                    name="content"
                    id="content"
                    editorState={editorState}
                    onEditorStateChange={(e) => {
                      // const mqal = draftToHtml(
                      //   convertToRaw(e.getCurrentContent())
                      // );
                      setEditorState(e);

                      const mqal = convertToRaw(e.getCurrentContent());

                      // console.log(mqal);

                      if (!mqal.blocks[0].text) {
                        // if (redirectPost) {
                        //   // mqal.blocks[0].text = 'welcome';
                        //   handleChange({
                        //     target: {
                        //       name: 'content',
                        //       value: EditorState.createWithContent(
                        //         ContentState.createFromBlockArray(
                        //           convertFromHTML('<p>My initial content.</p>')
                        //         )
                        //       ),
                        //     },
                        //   });
                        // } else {
                        handleChange({
                          target: { name: 'content', value: '' },
                        });
                        // }
                      } else {
                        handleChange({
                          target: { name: 'content', value: mqal },
                        });
                      }
                    }}
                    wrapperClassName="rich-editor"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    placeholder="المقال"
                    toolbar={{
                      options: [
                        'inline',
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'textAlign',
                        'colorPicker',
                        'link',
                        'embedded',
                        'emoji',
                        'history',
                      ],
                    }}
                  />
                  <ErrorMessage name="content" component={Error} />
                </div>
              </FormGroup>

              <Button type="submit" color="primary" disabled={isSubmitting}>
                {redirectPost ? 'تعديل' : 'نشر  '}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Add;
