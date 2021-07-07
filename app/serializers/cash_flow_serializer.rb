class CashFlowSerializer < ActiveModel::Serializer
  attributes :id, :amount, :concept, :kind, :kind_id

  belongs_to :student

  def kind
    case object.kind
    when 'pay'
      'paga'
    when 'debt'
      'debe'
    end
  end

  def kind_id
    CashFlow.kinds[object.kind]
  end
end
