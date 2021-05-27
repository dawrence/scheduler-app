class CashFlow < ApplicationRecord

  INSCRIPTION_A2 = 650000.freeze
  INSCRIPTION_B1 = 650000.freeze
  INSCRIPTION_C1 = 650000.freeze
  belongs_to :student

  enum kind: %i[pay debt]


  def self.debtor?
    self.total_debt > 0.0
  end

  def self.inscribe(concept: , amount:)
    self.create(amount: amount, kind: 'debt', concept: concept)
  end
  
  def self.set_fine(concept: 'Multa')
    self.create(amount: Fine::VALUE, kind: 'debt', concept: concept)
  end

  def self.total_debt
    self.debt.sum(:amount) - self.pay.sum(:amount)
  end

end
