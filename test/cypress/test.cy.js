describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
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

     cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に保存されました。');


// フォームがリセットされたことを確認
cy.get('#companyName').clear().should('have.value', '');
cy.get('#industry').clear().should('have.value', '');
cy.get('#contact').clear().should('have.value', '');
cy.get('#location').clear().should('have.value', '');

     cy.wait(5000);
  });
});