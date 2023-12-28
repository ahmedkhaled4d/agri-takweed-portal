import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { fetchData } from 'services/api.service';
// react plugin for creating notifications over the dashboard
import toast, { Toaster } from 'react-hot-toast';
import { Formik } from 'formik';
import {
  Form,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap';

const AddForm = ({ parent }) => {
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({});
  var randomCode = (Math.floor(Math.random() * 10000) + 10000)
    .toString()
    .substring(1);

  const handleAutoCompleteChange = (address) => {
    setAddress(address);
  };

  const handleAutoCompleteSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => setLatLng(latLng))
      .catch((error) => console.error('Error', error));
  };

  const handleSubmitForm = (values, { setSubmitting }) => {
    parent.type === 'governorate'
      ? (values.type = 'center')
      : (values.type = 'hamlet');
    setSubmitting(true);
    fetchData('/location', 'POST', values)
      .then((response) => response.json())
      .then((data) => {
        randomCode = (Math.floor(Math.random() * 10000) + 10000)
          .toString()
          .substring(1);
        toast.success('تم اضافه الوحده بنجاح');
        window.location.reload()
        setSubmitting(false);
      })
      .catch((error) => {
        toast.error('خطا ...');
      });
  };

  return (
    <>
      <Toaster />
      <div className="content">
        <Formik
          initialValues={{
            name_ar: '',
            name_en: '',
            coordinates: [],
            code: randomCode,
            parent: parent._id,
            type: '',
          }}
          validate={(values) => {
            const errors = {};
            values.name_ar = address;
            values.coordinates[0] = latLng.lat;
            values.coordinates[1] = latLng.lng;
            if (!values.name_ar) {
              errors.name_ar = 'مطلوب';
            }
            if (!values.name_en) {
              errors.name_en = 'مطلوب';
            }
            return errors;
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  disabled={true}
                  value={'تابعه لنقطة ' + parent.name_ar}
                ></Input>
              </FormGroup>
              <FormGroup>
                <PlacesAutocomplete
                  value={address}
                  onChange={handleAutoCompleteChange}
                  onSelect={handleAutoCompleteSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <Input
                        name="name_ar"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name_ar}
                        {...getInputProps({
                          placeholder: 'الموقع عربي',
                          className: 'location-search-input',
                        })}
                      />

                      <ListGroup>
                        {loading && <div>تحميل ...</div>}
                        {suggestions.map((suggestion) => {
                          return (
                            <ListGroupItem
                              {...getSuggestionItemProps(suggestion)}
                            >
                              <span>{suggestion.description}</span>
                            </ListGroupItem>
                          );
                        })}
                      </ListGroup>
                    </div>
                  )}
                </PlacesAutocomplete>
                {errors.name_ar && touched.name_ar && errors.name_ar}
              </FormGroup>

              <FormGroup>
                <Input
                  placeholder="الموقع انجليزي"
                  name="name_en"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name_en}
                />
                {errors.name_en && touched.name_en && errors.name_en}
              </FormGroup>
              <FormGroup>
                <Input
                  type="number"
                  disabled={true}
                  value={randomCode}
                  name="code"
                />
              </FormGroup>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                اضف
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddForm;
