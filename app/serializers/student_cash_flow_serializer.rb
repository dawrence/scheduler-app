class StudentCashFlowSerializer < ActiveModel::Serializer
  attributes  :id, :id_number, :full_name, :phone, :age, :status, :status_text,
              :email, :license_type, :available_hours, :assigned_hours,
              :total_cash_flow_debt

  has_many :cash_flows

  def cash_flows
    object.cash_flows.order(created_at: :desc)
  end

  def status
    Student.statuses[object.status]
  end

  def total_cash_flow_debt
    object.cash_flows.total_debt
  end
end
