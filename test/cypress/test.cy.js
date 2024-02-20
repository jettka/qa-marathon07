describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報入力画面から確認画面へ遷移する', () => {
    cy.visit('/aoi_kobayashi/customer/add.html'); // テスト対象のページにアクセス
    cy.window().then((win) => {
      // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
      win.alert('顧客情報が正常に保存されました。');
    });

      // テストデータの読み込み
      cy.fixture('customerData').then((data) => {
        // フォームの入力フィールドにテストデータを入力
        const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        cy.get('#companyName').type(data.companyName);
        cy.wait(500);
        cy.get('#industry').type(data.industry);
        cy.get('#contact').type(uniqueContactNumber);
        cy.get('#location').type(data.location);

      });

   // フォームの送信
     cy.get('#customer-form').submit();


// フォームがリセットされたことを確認
cy.get('#companyName').should('have.value', '');
cy.get('#industry').should('have.value', '');
cy.get('#contact').should('have.value', '');
cy.get('#location').should('have.value', '');

     cy.wait(3000);
  });



  it('確認画面からリストへ追加する', () => {
    cy.visit('/aoi_kobayashi/customer/add-confirm.html'); // テスト対象のページにアクセス

    cy.wait(1000);
    cy.get('#add-customer-btn').click();
    cy.wait(2000);
   //確認内容がリセットされている確認
    cy.get('#confirmation-details').should('have.value', '');
   //入力画面へ戻れるか確認
   cy.get('#back-btn').click();
   cy.url().should('include', '/aoi_kobayashi/customer/add.html');

     cy.wait(5000);
  });
});