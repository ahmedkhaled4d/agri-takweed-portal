describe('template spec', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });
  it('passes', () => {
    cy.visit('http://localhost:3000/admin/dashboard');
    cy.get('.pr-20 > form > :nth-child(1) > .form-control-lg').type(
      'admin@mail.com'
    );
    cy.get('.pr-20 > form > :nth-child(2) > .form-control').type(
      'mahaseelAdmin'
    );
    cy.get('.pr-20 > form > .default-button').click();
    cy.get(':nth-child(2) > .nav-link > p').click({ timeout: 6000 });
    cy.get('.card-header > a > .btn').click({ timeout: 7000 });
    for (let i = 0; i < 2; i++) {
      cy.get(`select[name="totalData[${i}].dayOfWeek"]`).select(`السبت`);
      cy.get(`input[name="totalData[${i}].date"]`).type(`ad`);
      cy.get(`input[name="totalData[${i}].mahaseelEngineer"]`).type(`ad`);
      cy.get(`input[name="totalData[${i}].plantQuarantineEngineer"]`).type(
        `ad`
      );
      cy.get(`select[name="totalData[${i}].visitDetails"]`).select(
        `زيارة أولى`
      );
      cy.get(`input[name="totalData[${i}].sampleNumber"]`).type(`5`);
      cy.get(`input[name="totalData[${i}].farmName"]`).type(`ad`);
      cy.get(`input[name="totalData[${i}].owner"]`).type(`ad`);
      cy.get(`input[name="totalData[${i}].ownerPhone"]`).type(`01142481868`);
      cy.get(`input[name="totalData[${i}].representative"]`).type(`ad`);
      cy.get(`input[name="totalData[${i}].representativePhone"]`).type(
        `01142481868`
      );
      cy.get(`select[name="totalData[${i}].governorate"]`).select(`الجيزة`, {
        timeout: 7000,
      });
      cy.get(`select[name="totalData[${i}].center"]`).select(`مركز البدرشين`, {
        timeout: 7000,
      });
      cy.get(`select[name="totalData[${i}].hamlet"]`).select(`الشنباب`, {
        timeout: 7000,
      });
      cy.get(`select[name="totalData[${i}].crop"]`).select(`بصل`);
      cy.get(`input[name="totalData[${i}].totalArea"]`).type(`50`);
      cy.get(`input[name="totalData[${i}].varieties"]`).type(`ليمون-برتقال`);
      cy.get(`input[name="totalData[${i}].area"]`).type(`40-50`);
      cy.get(`input[name="totalData[${i}].season"]`).type(`2023`);
      if (i != 1) cy.contains('اضافة +').click();
    }
    cy.get('button').contains('تسجيل').click();
  });

  cy.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
});
