function useTranslate(language) {
  // console.log(language);
  return (key, fallback) => {
    const translation = language?.find(
      (translation) => translation.key === key
    )?.value;

    return translation || fallback || key;
  };
}

export default useTranslate;
