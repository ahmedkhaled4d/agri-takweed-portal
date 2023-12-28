import React from 'react';

import { Field, Formik } from 'formik';
// import { Form, FormGroup, Input, Button, Label, Col, Row } from 'reactstrap';
import styles from './healthCertificate.module.css';
import { language } from '../../../../variables/languages.js';
import useTranslate from 'utils/customHooks/useTranslate';

// import healthstyles from './healthCertificate.module.css';
const HealthCertificateModal = ({ handelSending, formLang }) => {
  const translate = useTranslate(language);
  const handleSubmitForm = (values, { setSubmitting }) => {
    // console.log(values);
    setSubmitting(true);
    handelSending(values);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{ title: '', content: '', checked: [] }}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = 'مطلوب';
            }
            if (!values.content) {
              errors.content = 'مطلوب';
            }
            if (values.title.length > 128) {
              errors.title = 'الحد الاقصي للعنوان 128';
            }
            if (values.content.length > 255) {
              errors.content = 'الحد الاقصي للرساله 255';
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
            <div>
              <form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">
                      {/* To the National Plant Protection Organization Of : */}
                      {formLang === 'en'
                        ? 'To the National Plant Protection Organization Of :'
                        : translate(
                            'To the National Plant Protection Organization Of'
                          ) + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputEmail4"
                      placeholder="National Plant Protection Organization"
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">
                      {formLang === 'en'
                        ? 'Declared name and address of Consignce :'
                        : translate('Declared name and address of Consignce') +
                          ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress"
                      placeholder="1234 Main St"
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <label htmlFor="inputPassword4">
                    {formLang === 'en'
                      ? 'Name and address of exporter :'
                      : translate('Name and address of exporter') + ' :'}
                  </label>
                  <textarea
                    className={[styles.health_input, 'form-control'].join(' ')}
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Name and address of exporter"
                  ></textarea>
                </div>

                {/* Description Of The Consignment */}
                <div className={styles.health_title}>
                  <p style={{ color: 'black', fontSize: '1.5rem' }}>
                    {formLang === 'en'
                      ? 'Description Of The Consignment'
                      : translate('Description Of The Consignment')}
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="inputAddress">
                      {formLang === 'en'
                        ? 'Declared means of Conveyance :'
                        : translate('Declared means of Conveyance') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress"
                      placeholder="Vera A"
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputAddress2">
                      {formLang === 'en'
                        ? 'point of entry :'
                        : translate('point of entry') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress2"
                      placeholder="Novorossiysk"
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputState">
                      {formLang === 'en'
                        ? 'Place of origin :'
                        : translate('Place of origin') + ' :'}
                    </label>
                    <select
                      id="inputState"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                    >
                      <option selected>اختر...</option>
                      <option>مصر</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">
                      {formLang === 'en'
                        ? 'Distinguishing marks :'
                        : translate('Distinguishing marks') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress"
                      placeholder="CONTAINER NO: MMBU3287808"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress2">
                      {formLang === 'en'
                        ? 'Number and description of packages :'
                        : translate('Number and description of packages') +
                          ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress2"
                      placeholder="1664 PLACTIC BOX ON 21 PALLETS"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">
                      {formLang === 'en'
                        ? 'Name of produce and quantity declared :'
                        : translate('Name of produce and quantity declared') +
                          ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress"
                      placeholder="FRESH EGYPTIAN VALENCIA ORANGE G.W:27044 KGS"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress2">
                      {formLang === 'en'
                        ? 'Botanical name of plants :'
                        : translate('Botanical name of plants') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress2"
                      placeholder="CITRUS SINENSIS"
                    />
                  </div>
                </div>

                {/* Disinfestaions and/or Disinfections Treatment */}
                <div className={styles.health_title}>
                  <p style={{ color: 'black', fontSize: '1.5rem' }}>
                    {formLang === 'en'
                      ? 'Disinfestaions and/or Disinfections Treatment'
                      : translate(
                          'Disinfestaions and/or Disinfections Treatment'
                        )}
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="inputAddress">
                      {formLang === 'en' ? 'Date :' : translate('Date') + ' :'}
                    </label>
                    <input
                      type="date"
                      style={{ direction: formLang === 'en' ? 'ltr' : 'rtl' }}
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress"
                      placeholder="date"
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputAddress2">
                      {formLang === 'en'
                        ? 'Treatment :'
                        : translate('Treatment') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress2"
                      placeholder="xxxxxxxxxx"
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputAddress2">
                      {formLang === 'en'
                        ? 'Chemical (active ingredient) :'
                        : translate('Chemical (active ingredient)') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress2"
                      placeholder="xxxxxxxxxx"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">
                      {formLang === 'en'
                        ? 'Concentraion :'
                        : translate('Concentraion') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress"
                      placeholder="xxxxxxxxxxxxx"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress2">
                      {formLang === 'en'
                        ? 'Duration and temperature :'
                        : translate('Duration and temperature') + ' :'}
                    </label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputAddress2"
                      placeholder="xxxxxxxxxxxxxx"
                    />
                  </div>
                </div>
                <div className="form-group ">
                  <label for="inputPassword4">
                    Additional information :
                    {formLang === 'en'
                      ? 'Additional information :'
                      : translate('Additional information') + ' :'}
                  </label>
                  <textarea
                    className={[styles.health_input, 'form-control'].join(' ')}
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="write what you want"
                  ></textarea>
                </div>

                {/* <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputCity">City</label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputCity"
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputState">State</label>
                    <select id="inputState" className="form-control">
                      <option selected>Choose...</option>
                      <option>...</option>
                    </select>
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputZip">Zip</label>
                    <input
                      type="text"
                      className={[styles.health_input, 'form-control'].join(
                        ' '
                      )}
                      id="inputZip"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-check">
                    <input
                      className={[styles.health_input, 'form-check-input'].join(
                        ' '
                      )}
                      type="checkbox"
                      id="gridCheck"
                    />
                    <label className="form-check-label" htmlFor="gridCheck">
                      Check me out
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign in
                </button> */}
              </form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default HealthCertificateModal;
