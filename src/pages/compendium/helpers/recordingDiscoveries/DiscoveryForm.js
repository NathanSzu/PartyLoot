import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../../utils/contexts/GlobalFeatures';
import QuillInput from '../../../common/QuillInput';
import RaritySelect from '../../../common/RaritySelect';
import TypeSelect from '../../../common/TypeSelect';
import { addCompendiumItem, updateCompendiumItem } from '../../../../controllers/compendiumController';

export function DiscoveryForm({ item, showModal, handleCloseModal, setQueryParams }) {
  const { currentUser, db } = useContext(AuthContext);
  const { setToastHeader, setToastContent, toggleShowToast } = useContext(GlobalFeatures);

  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [touched, setTouched] = useState({});
  const [wasValidated, setWasValidated] = useState(false);

  const initialState = {
    itemName: '',
    maxCharges: '',
    likeCount: 0,
    itemDesc: '',
    rarity: '',
    acknowledgement: false,
    published: false,
    type: '',
  };

  const [discoveryRecord, setDiscoveryRecord] = useState(initialState);

  useEffect(() => {
    if (item) {
      setDiscoveryRecord({
        itemName: item.itemName,
        maxCharges: item.maxCharges,
        itemDesc: item.itemDesc || '',
        rarity: item.rarity || '',
        acknowledgement: item.acknowledgement || false,
        type: item.type || '',
      });
    } else {
      setDiscoveryRecord(initialState);
    }
  }, [item, showModal]);

  const handleClose = () => {
    handleCloseModal();
    setConfirmDelete(false);
    setTouched({});
    setWasValidated(false);
  };

  const handleInputChange = (field, value) => {
    setDiscoveryRecord((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFieldInvalid = (field) => {
    if (!touched[field] && !wasValidated) return false;
    const errors = validateDiscoveryRecord(discoveryRecord);
    return errors[field];
  };

  const validateDiscoveryRecord = (record) => {
    return {
      itemName: !record.itemName.trim(),
      rarity: !record.rarity.trim(),
      maxCharges: record.maxCharges && !/^\d+$/.test(record.maxCharges),
      type: !record.type.trim(),
      acknowledgement: !record.acknowledgement,
    };
  };

  const saveDiscovery = async (published = false) => {
    setWasValidated(true);
    const errors = validateDiscoveryRecord(discoveryRecord);
    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      return;
    }
    setLoading(true);

    const discoveryData = {
      ...discoveryRecord,
      creatorId: currentUser.uid,
      itemNameLower: discoveryRecord.itemName.toLowerCase(),
      published,
    };

    try {
      if (item) {
        await updateCompendiumItem(item.id, discoveryData);
        setToastHeader('Item changes saved');
        setToastContent(
          `Changes to your item "${discoveryRecord.itemName}" have been ${
            published ? 'published to the compendium' : 'saved as a draft'
          }.`
        );
      } else {
        await addCompendiumItem(discoveryData);
        setToastHeader('Item recorded');
        setToastContent(`You have successfully recorded your item "${discoveryRecord.itemName}" in the compendium.`);
      }
      setLoading(false);
      handleClose();
      toggleShowToast();
      setQueryParams();
    } catch (err) {
      setLoading(false);
      console.error('Error saving discovery', err);
      handleClose();
    }
  };

  const deleteEntry = () => {
    if (!confirmDelete) return;
    setLoading(true);
    db.collection('compendium')
      .doc(item.id)
      .delete()
      .then(() => {
        setLoading(false);
        handleClose();
        setToastHeader('Item deleted');
        setToastContent(`Your item "${discoveryRecord.itemName}" has been successfully deleted.`);
        toggleShowToast();
        setQueryParams();
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error deleting entry', err);
      });
  };

  const modalClass = showModal ? 'modal d-block show' : 'modal d-none';

  return (
    <div className={modalClass} tabIndex='-1' style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className='modal-dialog'>
        <form
          className={`modal-content rounded ${wasValidated ? 'was-validated' : 'needs-validation'}`}
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <div className='modal-header'>
            <h5 className='modal-title'>{item ? 'Edit Discovery' : 'Record a Discovery'}</h5>
            <button type='button' className='btn-close' aria-label='Close' onClick={handleClose}></button>
          </div>

          <div className='modal-body'>
            <div className='row mb-2'>
              <div className='col'>
                <div>
                  <label htmlFor='discovery-item-name' className='form-label text-start w-100'>
                    Item Name
                  </label>
                  <input
                    id='discovery-item-name'
                    className={`form-control${isFieldInvalid('itemName') ? ' is-invalid' : ''}`}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, itemName: true }))}
                    type='text'
                    placeholder='Item name'
                    value={discoveryRecord.itemName}
                    data-cy='new-discovery-name'
                    required
                  />
                  {isFieldInvalid('itemName') && (
                    <div className='invalid-feedback text-start'>Item name is required!</div>
                  )}
                </div>
              </div>
              <div className='col-3 ps-0'>
                <div>
                  <label htmlFor='discovery-max-charges' className='form-label text-start w-100'>
                    Charges
                  </label>
                  <input
                    id='discovery-max-charges'
                    className={`form-control${isFieldInvalid('maxCharges') ? ' is-invalid' : ''}`}
                    onChange={(e) => handleInputChange('maxCharges', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, maxCharges: true }))}
                    type='text'
                    placeholder='Charges'
                    value={discoveryRecord.maxCharges}
                    data-cy='new-discovery-charges'
                    maxLength='3'
                  />
                  {isFieldInvalid('maxCharges') && (
                    <div className='invalid-feedback'>
                      {discoveryRecord.maxCharges && !/^\d+$/.test(discoveryRecord.maxCharges)
                        ? 'Item charge values must be a positive number!'
                        : 'Charges are required!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col pe-0'>
                <label htmlFor='discovery-type' className='form-label text-start w-100'>
                  Type
                </label>
                <TypeSelect
                  itemData={discoveryRecord}
                  setItemData={handleInputChange}
                  isInvalid={isFieldInvalid('type')}
                  onBlur={() => setTouched((prev) => ({ ...prev, type: true }))}
                  inputId='discovery-type'
                />
              </div>
              <div className='col'>
                <label htmlFor='discovery-rarity' className='form-label text-start w-100'>
                  Rarity
                </label>
                <RaritySelect
                  itemData={discoveryRecord}
                  setItemData={handleInputChange}
                  isInvalid={isFieldInvalid('rarity')}
                  onBlur={() => setTouched((prev) => ({ ...prev, rarity: true }))}
                  inputId='discovery-rarity'
                />
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col'>
                <label htmlFor='discovery-item-desc' className='form-label text-start w-100'>
                  Description
                </label>
                <QuillInput
                  itemDesc={discoveryRecord.itemDesc}
                  setItemDesc={(value) => handleInputChange('itemDesc', value)}
                  placeholder='Please include a detailed description'
                  onShowModalChange={showModal}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='alert alert-info'>
                  <div className='form-check'>
                    <input
                      className={`form-check-input${isFieldInvalid('acknowledgement') ? ' is-invalid' : ''}`}
                      type='checkbox'
                      id='discovery-acknowledgement'
                      data-cy='discovery-acknowledgement'
                      onChange={() => handleInputChange('acknowledgement', !discoveryRecord.acknowledgement)}
                      checked={!!discoveryRecord.acknowledgement}
                      required
                    />
                    <label className='form-check-label text-start' htmlFor='discovery-acknowledgement'>
                      By checking this box you acknowledge that any profane or offensive language is grounds for
                      deletion of this post and removal of community features from your account.
                    </label>
                    {isFieldInvalid('acknowledgement') && (
                      <div className='invalid-feedback d-block'>Please review the acknowledgement!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='modal-footer row'>
            {item && (
              <div className='col'>
                {confirmDelete ? (
                  <button
                    disabled={loading}
                    className='btn btn-danger w-100'
                    type='button'
                    onClick={deleteEntry}
                    data-cy={`compendium-delete-confirmation-${item.itemName}`}
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    disabled={loading}
                    className='btn btn-danger w-100'
                    type='button'
                    onClick={() => setConfirmDelete(true)}
                    data-cy={`compendium-delete-${item.itemName}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
            <div className='col'>
              <button
                disabled={loading}
                className='btn btn-warning w-100'
                type='button'
                onClick={() => saveDiscovery()}
                data-cy={`compendium-save-draft-${item?.itemName && item?.itemName}`}
              >
                Save
              </button>
            </div>
            <div className='col'>
              <button
                disabled={loading}
                className='btn btn-success w-100'
                type='button'
                onClick={() => saveDiscovery(true)}
                data-cy='compendium-save'
              >
                Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
