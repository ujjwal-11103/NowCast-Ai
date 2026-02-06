export const CEOModel = {
  modifyTimePeriodList: (data) => {
    const modifiedList = [];
    data.forEach((element) => {
      modifiedList.push({ name: element, code: element });
    });
    return modifiedList;
  },
};
